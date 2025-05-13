import { Module } from '@nestjs/common';

import { TransactionsController } from './infra/http/controllers/transactions.controller';
import { HealthController } from './infra/http/controllers/health.controller';
import { InMemoryTransactionsRepository } from './infra/repositories/in-memory/in-memory-transactions.repository';
import { CreateTransactionUseCase } from './app/use-cases/create-transaction.use-case';
import { DeleteAllTransactionsUseCase } from './app/use-cases/delete-all-transactions.use-case';
import { GetStatisticsUseCase } from './app/use-cases/get-statistics.use-case';
import { TRANSACTIONS_REPOSITORY } from './infra/repositories/transactions.repository';

@Module({
  imports: [],
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
