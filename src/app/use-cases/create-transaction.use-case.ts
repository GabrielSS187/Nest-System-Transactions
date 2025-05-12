import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../../infra/repositories/transactions.repository';
import { Transaction } from '../../domain/entities/transaction.entity';

interface CreateTransactionInput {
  amount: number;
  timestamp: Date;
}

@Injectable()
export class CreateTransactionUseCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  execute(input: CreateTransactionInput): void {
    const transaction = new Transaction(input.amount, input.timestamp);
    this.transactionsRepository.create(transaction);
  }
}
