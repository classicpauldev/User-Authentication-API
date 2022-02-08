import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  /** Finds a user by email address. */
  async findByEmail(email: string): Promise<User | null> {
    return this.userModel.findOne({ email }).exec();
  }

  /** Finds a user by MongoDB ObjectId. */
  async findById(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  /** Creates a new user with the given email and hashed password. */
  async create(email: string, hashedPassword: string): Promise<User> {
    const user = new this.userModel({ email, password: hashedPassword });
    return user.save();
  }
}
