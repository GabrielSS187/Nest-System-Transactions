import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../transactions.repository';
import { Transaction } from '../../../domain/entities/transaction.entity';

@Injectable()
export class InMemoryTransactionsRepository implements TransactionsRepository {
  private transactionsByClient = new Map<string, Transaction[]>();

  create(clientId: string, transaction: Transaction): void {
    const transactions = this.transactionsByClient.get(clientId) ?? [];
    transactions.push(transaction);
    this.transactionsByClient.set(clientId, transactions);
  }

  deleteAll(): void {
    this.transactionsByClient.clear();
  }

  findByClient(clientId: string): Transaction[] {
    return this.transactionsByClient.get(clientId) ?? [];
  }

  findAll(): Transaction[] {
    return Array.from(this.transactionsByClient.values()).flat();
  }
}
