import {
  IsNumber,
  IsISO8601,
  Min,
  IsString,
  IsOptional,
} from 'class-validator';

export class CreateTransactionDto {
  @IsNumber()
  @Min(0)
  amount: number;

  @IsISO8601()
  timestamp: string;

  @IsOptional()
  @IsString()
  receiverClientId?: string;
}
