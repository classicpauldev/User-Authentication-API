import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

/** Guard for local (email/password) authentication. */
@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {}
