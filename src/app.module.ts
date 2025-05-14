import { Module } from '@nestjs/common';

import { UseCasesModule } from './app/use-cases/use-cases.module';
import { TransactionsController } from './infra/http/controllers/transactions.controller';
import { HealthController } from './infra/http/controllers/health.controller';

import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'http';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { CustomThrottlerGuard } from './infra/http/guards/custom-throttler.guard';

// const isDev = process.env.NODE_ENV === 'development';
// const isTest = process.env.NODE_ENV === 'test';

@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          name: 'base',
          ttl: 1000 * 60, // 1 min
          limit: 20,
        },
      ],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        redact: ['req.headers.authorization'],
        genReqId: (req: IncomingMessage) =>
          (req.headers['x-request-id'] as string) || crypto.randomUUID(),
      },
    }),
    UseCasesModule,
  ],
  controllers: [TransactionsController, HealthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: CustomThrottlerGuard,
    },
  ],
})
export class AppModule {}
