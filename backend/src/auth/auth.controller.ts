import { Controller, Post, Body, Get, Req, Res, UseGuards } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { JwtService } from '@nestjs/jwt';
import type { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  

  //used to register new user
  @Post('register')
  async register(@Body() body: any) {
    const { name, email, password, acceptedTerms } = body;

    if (!name || !email || !password) {
      return { success: false, message: 'All fields are required' };
    }
    if (!acceptedTerms) {
      return { success: false, message: 'Please accept terms & conditions' };
    }

    return this.usersService.createUser(name, email, password);
  }

  


  //used to login via existed user
  @Post('login')
  async login(@Body() body: any) {
    const { email, password } = body;

    if (!email || !password) {
      return { success: false };
    }

    const result = await this.usersService.validateUser(email, password);

  
    if (result.success && result.user) {
      const token = this.jwtService.sign({
        email: result.user.email,
        name: result.user.name,
      });
      return { success: true, access_token: token };
    }

    return result;
  }

  


  //used to redirect to google login
  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}
  


  //used to get login data from google login
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req, @Res() res: Response) {
    const user = req.user;

  
    const token = this.jwtService.sign({
      email: user.email,
      name: user.name,
    });

    

    //generates token to keep login and responds with data got from google login
    res.setHeader('Content-Type', 'text/html');
    return res.send(`
      <script>
        window.opener.postMessage(${JSON.stringify({
          success: true,
          token,
          email: user.email,
          name: user.name,
        })}, "http://localhost:3000");
        window.close();
      </script>
    `);
  }
}
