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
    private readonly deleteAllUseCase: DeleteAllTransactionsUseCase,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() dto: CreateTransactionDto): void {
    const timestamp = new Date(dto.timestamp);

    if (isNaN(timestamp.getTime())) {
      throw new BadRequestException('Invalid timestamp');
    }

    const now = new Date();
    if (timestamp > now) {
      throw new UnprocessableEntityException(
        'Timestamp cannot be in the future',
      );
    }

    this.createTransactionUseCase.execute({
      amount: dto.amount,
      timestamp,
      receiverClientId: dto.receiverClientId,
    });
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  deleteAll(): void {
    this.deleteAllUseCase.execute();
  }

  @Get('/statistics')
  @HttpCode(HttpStatus.OK)
  getStatistics() {
    // retorna estatísticas globais para fins de debug (ou você pode remover)
    return this.getStatisticsUseCase.execute();
  }
}
