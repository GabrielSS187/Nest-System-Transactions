// src/app/use-cases/use-cases.module.ts

import { Module } from '@nestjs/common';
import { CreateTransactionUseCase } from './create-transaction.use-case';
import { DeleteAllTransactionsUseCase } from './delete-all-transactions.use-case';
import { GetStatisticsUseCase } from './get-statistics.use-case';
import { TRANSACTIONS_REPOSITORY } from '../../infra/repositories/transactions.repository';
import { InMemoryTransactionsRepository } from '../../infra/repositories/in-memory/in-memory-transactions.repository';
import { StatisticsGateway } from '../../infra/websockets/statistics.gateway';

@Module({
  providers: [
    {
      provide: TRANSACTIONS_REPOSITORY,
      useClass: InMemoryTransactionsRepository,
    },
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    GetStatisticsUseCase,
    StatisticsGateway,
  ],
  exports: [
    CreateTransactionUseCase,
    DeleteAllTransactionsUseCase,
    GetStatisticsUseCase,
  ],
})
export class UseCasesModule {}
