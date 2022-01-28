import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { BCRYPT_ROUNDS } from '../common/constants';
import * as bcrypt from 'bcryptjs';

interface JwtUser {
  _id?: unknown;
  email: string;
}

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user: JwtUser) {
    const payload = { sub: String(user._id), email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user._id, email: user.email },
    };
  }

  async register(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_ROUNDS);
    const user = await this.usersService.create(email, hashedPassword);
    const payload = { sub: String(user._id), email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user._id, email: user.email },
    };
  }
}
