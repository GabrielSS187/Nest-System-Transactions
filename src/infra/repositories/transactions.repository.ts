import { Transaction } from '../../domain/entities/transaction.entity';

export const TRANSACTIONS_REPOSITORY = Symbol('TransactionsRepository');

export interface TransactionsRepository {
  create(clientId: string, transaction: Transaction): void;
  deleteAll(): void;
  findByClient(clientId: string): Transaction[];
  findAll(): Transaction[];
}
