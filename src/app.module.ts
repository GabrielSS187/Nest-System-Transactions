import { Module } from '@nestjs/common';

import { TransactionsController } from './infra/http/controllers/transactions.controller';
import { HealthController } from './infra/http/controllers/health.controller';
import { InMemoryTransactionsRepository } from './infra/repositories/in-memory/in-memory-transactions.repository';
import { CreateTransactionUseCase } from './app/use-cases/create-transaction.use-case';
import { DeleteAllTransactionsUseCase } from './app/use-cases/delete-all-transactions.use-case';
import { GetStatisticsUseCase } from './app/use-cases/get-statistics.use-case';
import { TRANSACTIONS_REPOSITORY } from './infra/repositories/transactions.repository';

import { LoggerModule } from 'nestjs-pino';
import { IncomingMessage } from 'http';
import pino from 'pino';

const isDev = process.env.NODE_ENV === 'development';
const isTest = process.env.NODE_ENV === 'test';

@Module({
  imports: [
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
  ],
  controllers: [TransactionsController, HealthController],
  providers: [
    {
      provide: TRANSACTIONS_REPOSITORY,
      useClass: InMemoryTransactionsRepository,
    },
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    GetStatisticsUseCase,
  ],
})
export class AppModule {}
