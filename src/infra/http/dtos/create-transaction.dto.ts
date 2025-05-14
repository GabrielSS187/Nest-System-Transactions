import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNumber,
  Min,
  IsOptional,
  IsISO8601,
  IsString,
} from 'class-validator';

export class CreateTransactionDto {
  @ApiProperty({
    description:
      'Valor da transação (obrigatório). Deve ser maior ou igual a 0.50.',
    example: 100.5,
  })
  @IsNumber()
  @Min(0.5)
  amount: number;

  @ApiPropertyOptional({
    description:
      'Data/hora da transação (ISO 8601). Se não fornecido, será usada a hora atual.',
    example: '2025-05-13T15:30:00Z',
  })
  @IsOptional()
  @IsISO8601()
  timestamp?: string;

  @ApiPropertyOptional({
    description: 'ID do cliente WebSocket que vai receber a transação.',
    example: 'ws-user',
  })
  @IsOptional()
  @IsString()
  receiverClientId?: string;
}
