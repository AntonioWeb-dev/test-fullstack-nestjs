import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';
import { CredentialsDto } from './dto/credentials';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  async login(credentialsDto: CredentialsDto) {
    const { username, password } = credentialsDto;
    const objUser = await this.userService.checkCredentials(username, password);

    if (objUser === null) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const access_token = await this.newToken(objUser);
    return { access_token };
  }

  async newToken(objUser: User) {
    const jwtPayload = {
      id: objUser.id,
    };
    const newToken = this.jwtService.sign(jwtPayload, {
      expiresIn: '24h',
    });
    return newToken;
  }
}
