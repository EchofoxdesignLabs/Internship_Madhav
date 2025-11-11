import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from './user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  
  //used to find user
  async findByEmail(email: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ email }).exec();
  }

  


  //used to create user and return to register.jsx
  async createUser(name: string, email: string, password: string) {
    const existing = await this.findByEmail(email);
    if (existing) {
      return { success: false, message: 'Email already exists' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    return { success: true, user: newUser };
  }

  


  //used to login with user and returns to login.jsx
  async validateUser(email: string, password: string) {
    const user = await this.findByEmail(email);
    if (!user) {
      return { success: false,  message: 'User not found' };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return { success: false, message: 'Invalid password' };
    }

    return { success: true, user };
  }

  



  //get and validate google login
  async createGoogleUser(name: string, email: string): Promise<UserDocument> {
  
    let user = await this.findByEmail(email);

    if (user) {
  
      return user;
    }


    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();
    return newUser;
  }
}
