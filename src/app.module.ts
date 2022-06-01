import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { DEFAULT_MONGODB_URI } from './common/constants';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/** Root application module. */
@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI || DEFAULT_MONGODB_URI,
    ),
    UsersModule,
    AuthModule,
    HealthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
