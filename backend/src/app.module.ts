import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthController } from './auth/auth.controller';
import { UsersService } from './users/users.service';
import { User, UserSchema } from './users/user.schema';
import { GoogleStrategy } from './auth/google.strategy'; 
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import * as dotenv from 'dotenv';

dotenv.config();


//getting database access from atlas mongodb and google id
@Module({
  imports: [
    
    MongooseModule.forRoot(process.env.MONGODB_URI || '', {
      dbName: process.env.DB_NAME || 'Login-data',
    }),

    
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),

    
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret_key',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),

    
    PassportModule.register({ defaultStrategy: 'google' }),
  ],

  
  controllers: [AuthController],
  providers: [UsersService, GoogleStrategy],
})
export class AppModule {}
