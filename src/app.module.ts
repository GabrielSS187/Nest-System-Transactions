/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Module } from '@nestjs/common';

import { TransactionsController } from './infra/http/controllers/transactions.controller';
import { HealthController } from './infra/http/controllers/health.controller';
import { InMemoryTransactionsRepository } from './infra/repositories/in-memory/in-memory-transactions.repository';
import { TransactionsRepository } from './infra/repositories/transactions.repository';
import { CreateTransactionUseCase } from './app/use-cases/create-transaction.use-case';
import { DeleteAllTransactionsUseCase } from './app/use-cases/delete-all-transactions.use-case';
import { GetStatisticsUseCase } from './app/use-cases/get-statistics.use-case';

@Module({
  imports: [],
  controllers: [TransactionsController, HealthController],
  providers: [
    {
      provide: TransactionsRepository,
      useClass: InMemoryTransactionsRepository,
    },
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    GetStatisticsUseCase,
  ],
})
export class AppModule {}
