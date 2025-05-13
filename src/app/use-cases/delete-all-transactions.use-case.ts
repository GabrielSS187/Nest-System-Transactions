import { Inject, Injectable } from '@nestjs/common';
import {
  TransactionsRepository,
  TRANSACTIONS_REPOSITORY,
} from '../../infra/repositories/transactions.repository';

@Injectable()
export class DeleteAllTransactionsUseCase {
  constructor(
    @Inject(TRANSACTIONS_REPOSITORY)
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  execute(): void {
    this.transactionsRepository.deleteAll();
  }
}
