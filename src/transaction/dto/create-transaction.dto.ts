import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateTransactionDto {
  @IsNotEmpty()
  @IsString()
  debitedAccountId: string;

  @IsNotEmpty()
  @IsString()
  creditedAccountId: string;

  @IsNotEmpty()
  @IsNumber()
  value: number;
}
