import { Transaction } from '../../domain/entities/transaction.entity';

export const TRANSACTIONS_REPOSITORY = Symbol('TransactionsRepository');

export interface TransactionsRepository {
  create(transaction: Transaction): void;
  deleteAll(): void;
  findAll(): Transaction[];
}
