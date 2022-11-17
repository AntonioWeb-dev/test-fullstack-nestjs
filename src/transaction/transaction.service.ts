import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';

@Injectable()
export class TransactionService {
  constructor(
    @InjectRepository(Transaction)
    private transactionRepository: Repository<Transaction>,
    private accountService: AccountService,
  ) {}

  async create(createTransactionDto: CreateTransactionDto) {
    const { creditedAccountId, debitedAccountId, value } = createTransactionDto;
    if (creditedAccountId === debitedAccountId) {
      throw new BadRequestException(
        'um usuário não pode realizar uma transferência para si mesmo',
      );
    }
    const creditedAccount = await this.accountService.findOne(
      creditedAccountId,
    );
    const debitedAccount = await this.accountService.findOne(debitedAccountId);
    if (debitedAccount.balance < value) {
      throw new BadRequestException('um usuário não possui o valor na conta');
    }
    try {
      await this.accountService.update(
        creditedAccountId,
        creditedAccount.balance + value,
      );
      await this.accountService.update(
        debitedAccountId,
        debitedAccount.balance - value,
      );
      const transaction = this.transactionRepository.create({
        value,
        creditedAccountId: creditedAccount,
        debitedAccountId: debitedAccount,
      });
      await transaction.save();
      return transaction;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async findAll(reqUser: User, order?: 'cash-in' | 'cash-out') {
    const filter = [
      { creditedAccountId: { id: reqUser.account.id } },
      { debitedAccountId: { id: reqUser.account.id } },
    ];
    if (order && order === 'cash-out') {
      filter.splice(0, 1);
    } else if (order === 'cash-in') {
      filter.splice(1, 1);
    }
    const transactions = await this.transactionRepository.find({
      where: filter,
      relations: ['creditedAccountId', 'debitedAccountId'],
    });
    return transactions;
  }

  async findOne(id: string) {
    const transaction = await this.transactionRepository.findOne({
      where: { id },
      relations: ['creditedAccountId', 'debitedAccountId'],
    });
    if (!transaction)
      throw new NotFoundException('Transaction não foi encontrada');
    return transaction;
  }
}
