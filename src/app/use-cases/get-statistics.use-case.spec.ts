// src/app/use-cases/get-statistics.use-case.spec.ts
import { GetStatisticsUseCase } from './get-statistics.use-case';
import { InMemoryTransactionsRepository } from '../../infra/repositories/in-memory/in-memory-transactions.repository';
import { Transaction } from '../../domain/entities/transaction.entity';

describe('GetStatisticsUseCase', () => {
  it('should calculate statistics for transactions within 60 seconds', () => {
    const repo = new InMemoryTransactionsRepository();
    const now = new Date();

    repo.create(new Transaction(10, new Date(now.getTime() - 10_000))); // 10s atrás
    repo.create(new Transaction(20, new Date(now.getTime() - 20_000))); // 20s atrás
    repo.create(new Transaction(30, new Date(now.getTime() - 70_000))); // 70s atrás (fora)

    const useCase = new GetStatisticsUseCase(repo);
    const stats = useCase.execute();

    expect(stats.count).toBe(2);
    expect(stats.sum).toBe(30);
    expect(stats.avg).toBe(15);
    expect(stats.min).toBe(10);
    expect(stats.max).toBe(20);
  });

  it('should return zeroed statistics if no valid transactions exist', () => {
    const repo = new InMemoryTransactionsRepository();
    const useCase = new GetStatisticsUseCase(repo);
    const stats = useCase.execute();

    expect(stats).toEqual({
      count: 0,
      sum: 0,
      avg: 0,
      min: 0,
      max: 0,
    });
  });
});
