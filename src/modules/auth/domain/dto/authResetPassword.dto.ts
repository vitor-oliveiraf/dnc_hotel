import { IsNotEmpty, IsString } from 'class-validator';

export class AuthResetPasswordDTO {
  @IsNotEmpty()
  @IsString()
  token: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
