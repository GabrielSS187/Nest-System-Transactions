import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  BadRequestException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateTransactionDto } from '../dtos/create-transaction.dto';
import { CreateTransactionUseCase } from '../../../app/use-cases/create-transaction.use-case';
import { DeleteAllTransactionsUseCase } from '../../../app/use-cases/delete-all-transactions.use-case';
import { GetStatisticsUseCase } from '../../../app/use-cases/get-statistics.use-case';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteAllTransactionsUseCase: DeleteAllTransactionsUseCase,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTransactionDto): void {
    const timestamp = new Date(dto.timestamp);
    if (isNaN(timestamp.getTime())) {
      throw new BadRequestException('Invalid timestamp format');
    }

    const now = new Date();
    if (timestamp > now) {
      throw new UnprocessableEntityException(
        'Transaction timestamp is in the future',
      );
    }

    this.createTransactionUseCase.execute({
      amount: dto.amount,
      timestamp,
    });
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  deleteAll(): void {
    this.deleteAllTransactionsUseCase.execute();
  }

  @Get('/statistics')
  @HttpCode(HttpStatus.OK)
  getStatistics() {
    return this.getStatisticsUseCase.execute();
  }
}
