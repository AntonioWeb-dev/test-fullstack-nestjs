import { IsNotEmpty, IsString, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(3)
  username: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(8)
  @Matches(/(?=.*\d)(?=.*[A-Z])/, {
    message:
      'password deve ser composta por pelo menos 8 caracteres, um número e uma letra maiúscula',
  })
  password: string;
}
