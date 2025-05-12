import { Transaction } from '../../domain/entities/transaction.entity';

export interface TransactionsRepository {
  create(transaction: Transaction): void;
  deleteAll(): void;
  findAll(): Transaction[];
}
