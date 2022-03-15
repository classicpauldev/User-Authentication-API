import { Controller, Get } from '@nestjs/common';

/** Health check endpoint for load balancers and monitoring. */
@Controller('health')
export class HealthController {
  @Get()
  check(): { status: string; timestamp: string } {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }
}
