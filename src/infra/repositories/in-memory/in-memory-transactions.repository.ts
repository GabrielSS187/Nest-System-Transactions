import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../transactions.repository';
import { Transaction } from '../../../domain/entities/transaction.entity';

@Injectable()
export class InMemoryTransactionsRepository implements TransactionsRepository {
  private transactions: Transaction[] = [];

  create(transaction: Transaction): void {
    this.transactions.push(transaction);
  }

  deleteAll(): void {
    this.transactions = [];
  }

  findAll(): Transaction[] {
    return this.transactions;
  }
}
