import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateAccountDto } from './dto/update-account.dto';
import { Account } from './entities/account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private accountRepository: Repository<Account>,
  ) {}

  async create(balance: number) {
    try {
      const account = this.accountRepository.create({ balance });
      await account.save();
      return account;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  findAll() {
    return `This action returns all account`;
  }

  async findOne(id: string) {
    const account = await this.accountRepository.findOne({
      where: { id },
    });
    if (!account) throw new NotFoundException('Account não foi encontrada');
    return account;
  }

  async update(id: string, balance: number) {
    try {
      await this.accountRepository.update({ id }, { balance });
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  remove(id: string) {
    return `This action removes a #${id} account`;
  }
}
