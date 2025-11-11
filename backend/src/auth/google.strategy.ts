import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    });
  }

  authorizationParams(): Record<string, string> {
    return {
      prompt: 'select_account',
    };
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile
  ): Promise<any> {
    const { name, emails } = profile;

    const email = emails?.[0]?.value;
    const fullName = name?.givenName
      ? `${name.givenName} ${name.familyName || ''}`.trim()
      : profile.displayName;

    if (!email) {
      throw new Error('Google account must have an email');
    }


    let user = await this.usersService.findByEmail(email);


    if (!user) {
      user = await this.usersService.createGoogleUser(fullName, email);
    }


    const token = this.jwtService.sign({
      email: user.email,
      name: user.name,
    });


    return {
      email: user.email,
      name: user.name,
      token,
    };
  }
}
