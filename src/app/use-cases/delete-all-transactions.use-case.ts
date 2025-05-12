import { Injectable } from '@nestjs/common';
import { TransactionsRepository } from '../../infra/repositories/transactions.repository';

@Injectable()
export class DeleteAllTransactionsUseCase {
  constructor(
    private readonly transactionsRepository: TransactionsRepository,
  ) {}

  execute(): void {
    this.transactionsRepository.deleteAll();
  }
}
