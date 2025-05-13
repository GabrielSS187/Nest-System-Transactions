import { Module } from '@nestjs/common';

import { UseCasesModule } from './app/use-cases/se-cases.module';
import { TransactionsController } from './infra/http/controllers/transactions.controller';
import { HealthController } from './infra/http/controllers/health.controller';
import { InMemoryTransactionsRepository } from './infra/repositories/in-memory/in-memory-transactions.repository';
import { TRANSACTIONS_REPOSITORY } from './infra/repositories/transactions.repository';

import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'http';
import pino from 'pino';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { StatisticsGateway } from './infra/websockets/statistics.gateway';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';
@Module({
  imports: [
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 60,
          limit: 20,
        },
      ],
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        redact: ['req.headers.authorization'],
        genReqId: (req: IncomingMessage) =>
          (req.headers['x-request-id'] as string) || crypto.randomUUID(),

        ...(isDev && {
          transport: {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname',
            },
          },
        }),

        ...(!isDev &&
          !isTest && {
            stream: pino.destination({
              dest: 'logs/app.log',
              mkdir: true,
              sync: false,
            }),
          }),
      },
    }),
    UseCasesModule,
  ],
  controllers: [TransactionsController, HealthController],
  providers: [
    {
      provide: TRANSACTIONS_REPOSITORY,
      useClass: InMemoryTransactionsRepository,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    StatisticsGateway,
  ],
})
export class AppModule {}
