import { Inject, Injectable } from '@nestjs/common';
import {
  TRANSACTIONS_REPOSITORY,
  TransactionsRepository,
} from '../../infra/repositories/transactions.repository';
import { Transaction } from '../../domain/entities/transaction.entity';
import { StatisticsGateway } from '../../infra/websockets/statistics.gateway';

interface CreateTransactionInput {
  amount: number;
  timestamp: Date;
  receiverClientId?: string;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    @Inject(TRANSACTIONS_REPOSITORY)
    private readonly transactionsRepository: TransactionsRepository,
    private readonly gateway: StatisticsGateway,
  ) {}

  execute(input: CreateTransactionInput): Transaction {
    const transaction = new Transaction(input.amount, input.timestamp);

    this.transactionsRepository.create(transaction);

    if (input.receiverClientId) {
      this.gateway.emitToClient(input.receiverClientId, {
        amount: input.amount,
        timestamp: input.timestamp,
      });
    }

    return transaction;
  }
}
