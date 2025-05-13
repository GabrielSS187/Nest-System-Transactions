import { CreateTransactionUseCase } from './create-transaction.use-case';
import { InMemoryTransactionsRepository } from '../../infra/repositories/in-memory/in-memory-transactions.repository';

describe('CreateTransactionUseCase', () => {
  it('deve criar uma transação', () => {
    const repository = new InMemoryTransactionsRepository();
    const useCase = new CreateTransactionUseCase(repository);

    const now = new Date();
    useCase.execute({ amount: 100.5, timestamp: now });

    const transactions = repository.findAll();
    expect(transactions.length).toBe(1);
    expect(transactions[0].amount).toBe(100.5);
    expect(transactions[0].timestamp).toEqual(now);
  });
});
