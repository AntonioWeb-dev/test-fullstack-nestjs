import * as bcrypt from 'bcrypt';
import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccountService } from 'src/account/account.service';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private accountService: AccountService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const account = await this.accountService.create(100);
      const passwordHashed = await bcrypt.hash(createUserDto.password, 10);
      const user = this.userRepository.create({
        username: createUserDto.username,
        password: passwordHashed,
        account,
      });
      await user.save();
      return user;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async findAll() {
    try {
      const users = await this.userRepository.find({ relations: ['account'] });
      return users;
    } catch (err) {
      throw new InternalServerErrorException();
    }
  }

  async findOne(id: string) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['account'],
    });
    if (!user) throw new NotFoundException('User não foi encontrado');
    return user;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  async checkCredentials(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: {
        username,
      },
    });
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    } else {
      return null;
    }
  }
}
