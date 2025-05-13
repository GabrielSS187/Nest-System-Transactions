import { ApiProperty } from '@nestjs/swagger';

export class BadRequestResponseDto {
  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Campo "timestamp" inválido.' })
  message: string;

  @ApiProperty({ example: 'Bad Request' })
  error: string;
}

export class UnprocessableResponseDto {
  @ApiProperty({ example: 422 })
  statusCode: number;

  @ApiProperty({ example: 'Timestamp não pode estar no futuro.' })
  message: string;

  @ApiProperty({ example: 'Unprocessable Entity' })
  error: string;
}
