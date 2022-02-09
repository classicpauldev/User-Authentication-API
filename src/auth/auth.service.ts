import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { BCRYPT_ROUNDS, ERROR_EMAIL_EXISTS, ERROR_INVALID_CREDENTIALS } from '../common/constants';
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

  /** Validates user credentials and returns the user if valid. */
  async validateUser(email: string, password: string) {
    const user = await this.usersService.findByEmail(email);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  /** Issues a JWT token for the authenticated user. */
  async login(user: JwtUser) {
    const payload = { sub: String(user._id), email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
      user: { id: user._id, email: user.email },
    };
  }

  /** Registers a new user and returns a JWT token. */
  async register(email: string, password: string) {
    const existing = await this.usersService.findByEmail(email);
    if (existing) {
      throw new ConflictException(ERROR_EMAIL_EXISTS);
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
