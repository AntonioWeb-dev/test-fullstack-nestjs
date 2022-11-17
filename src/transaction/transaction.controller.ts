import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  ValidationPipe,
  UnauthorizedException,
  Query,
} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(
    @Body(ValidationPipe) createTransactionDto: CreateTransactionDto,
    @Req() req,
  ) {
    if (req.user.account.id !== createTransactionDto.debitedAccountId) {
      throw new UnauthorizedException(
        'Usuário não pode debitar uma conta que não é dele',
      );
    }
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  async findAll(@Query() query, @Req() req) {
    const transactions = await this.transactionService.findAll(
      req.user,
      query.order,
    );
    return transactions;
  }

  @Get(':id')
  @UseGuards(AuthGuard('jwt'))
  async findOne(@Param('id') id: string, @Req() req) {
    const transaction = await this.transactionService.findOne(id);
    if (
      req.user.account.id !== transaction.debitedAccountId.id &&
      req.user.account.id !== transaction.creditedAccountId.id
    ) {
      throw new UnauthorizedException(
        'Usuário não pode visualizar uma transação que não é dele',
      );
    }
    return transaction;
  }
}
