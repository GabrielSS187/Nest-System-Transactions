import { Inject, Injectable } from '@nestjs/common';
import {
  TransactionsRepository,
  TRANSACTIONS_REPOSITORY,
} from '../../infra/repositories/transactions.repository';

@Injectable()
export class GetStatisticsUseCase {
  constructor(
    @Inject(TRANSACTIONS_REPOSITORY)
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  execute() {
    const TIME_WINDOW_MS = 60_000;

    const now = new Date();
    const transactions = this.transactionsRepository
      .findAll()
      .filter((t) => now.getTime() - t.timestamp.getTime() <= TIME_WINDOW_MS);

    const amounts = transactions.map((t) => t.amount);
    const count = amounts.length;
    const sum = amounts.reduce((a, b) => a + b, 0);
    const avg = count ? sum / count : 0;
    const min = count ? Math.min(...amounts) : 0;
    const max = count ? Math.max(...amounts) : 0;

    return {
      count,
      sum,
      avg,
      min,
      max,
    };
  }
}
