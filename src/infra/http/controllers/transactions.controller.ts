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
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import {
  BadRequestResponseDto,
  UnprocessableResponseDto,
} from '../dtos/error-response.dto';

@Controller('transactions')
export class TransactionsController {
  constructor(
    private readonly createTransactionUseCase: CreateTransactionUseCase,
    private readonly deleteAllUseCase: DeleteAllTransactionsUseCase,
    private readonly getStatisticsUseCase: GetStatisticsUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Criar uma transação.',
    description:
      'Criar uma nova transação. O campo "amount" é obrigatório. ' +
      'O campo "timestamp" é opcional; se omitido, o sistema usará a data/hora atual. ' +
      'O "receiverClientId" é opcional e representa o ID do cliente websocket.',
  })
  @ApiBody({
    type: CreateTransactionDto,
    description: 'Dados para criar a transação.',
  })
  @ApiCreatedResponse({
    description: 'Transação criada com sucesso.',
    type: CreateTransactionDto,
  })
  @ApiBadRequestResponse({
    description: 'Campo "timestamp" inválido.',
    type: BadRequestResponseDto,
  })
  @ApiResponse({
    status: 422,
    description: 'Timestamp não pode estar no futuro.',
    type: UnprocessableResponseDto,
  })
  create(@Body() dto: CreateTransactionDto) {
    const timestamp = dto.timestamp ? new Date(dto.timestamp) : new Date();

    if (isNaN(timestamp.getTime())) {
      throw new BadRequestException('Invalid timestamp');
    }

    const now = new Date();
    if (timestamp > now) {
      throw new UnprocessableEntityException(
        'Timestamp cannot be in the future',
      );
    }

    return this.createTransactionUseCase.execute({
      amount: dto.amount,
      timestamp,
      receiverClientId: dto.receiverClientId,
    });
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Deletar todas as transações.',
  })
  deleteAll(): void {
    this.deleteAllUseCase.execute();
  }

  @Get('/statistics')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Pegar todas as estatísticas das transações.',
    description:
      'Retornam todas as estatísticas das transações feitas no intervalo de 60 segundos.',
  })
  getStatistics() {
    return this.getStatisticsUseCase.execute();
  }
}
