import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'generated/prisma';
import { AuthLoginDto } from './domain/dto/authLogin.dto';
import * as bcrypt from 'bcrypt';
import { HttpStatus } from '@nestjs/common';
import { UserService } from '../users/user.services';
import { AuthRegisterDTO } from './domain/dto/authRegister.dto';
import { CreateUserDto } from '../users/domain/dto/createUser.dto';
import { Role } from 'generated/prisma';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async generateJwtToken(user: User) {
    const payload = { sub: user.id, name: user.name };
    const options = {
      expiresIn: '1d',
      issuer: 'dnc_hotel',
    };
    return {
      access_token: await this.jwtService.signAsync(payload, options),
    };
  }

  async login({ email, password }: AuthLoginDto) {
    const user = await this.userService.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
    return this.generateJwtToken(user);
  }

  async register(body: AuthRegisterDTO) {
    if (!body.name || !body.email || !body.password) {
      throw new HttpException(
        'Name, email and password are required',
        HttpStatus.BAD_REQUEST,
      );
    }

    const newUser: CreateUserDto = {
      name: body.name,
      email: body.email,
      password: body.password,
      role: body.role ?? Role.USER,
    };

    const user = await this.userService.createUser(newUser);
    return this.generateJwtToken(user);
  }
}
