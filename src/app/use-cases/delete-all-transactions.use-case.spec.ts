// src/app/use-cases/delete-all-transactions.use-case.spec.ts
import { DeleteAllTransactionsUseCase } from './delete-all-transactions.use-case';
import { InMemoryTransactionsRepository } from '../../infra/repositories/in-memory/in-memory-transactions.repository';
import { Transaction } from '../../domain/entities/transaction.entity';

describe('DeleteAllTransactionsUseCase', () => {
  it('should delete all transactions', () => {
    const repository = new InMemoryTransactionsRepository();
    repository.create(new Transaction(10, new Date()));
    repository.create(new Transaction(20, new Date()));

    const useCase = new DeleteAllTransactionsUseCase(repository);
    useCase.execute();

    const all = repository.findAll();
    expect(all).toHaveLength(0);
  });
});
