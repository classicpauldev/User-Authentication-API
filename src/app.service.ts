import { Injectable } from '@nestjs/common';

/** Root application service. */
@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }
}
