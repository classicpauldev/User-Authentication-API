import { Controller, Get } from '@nestjs/common';

/** Health check endpoint for load balancers and monitoring. */
@Controller('health')
export class HealthController {
  @Get()
  check() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
