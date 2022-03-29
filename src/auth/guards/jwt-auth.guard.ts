import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Guard for JWT Bearer token authentication. */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {}
