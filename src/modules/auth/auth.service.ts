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
import { AuthForgotPasswordDTO } from './domain/dto/authForgotPassword.dto';
import { ValidateTokenDTO } from './domain/dto/authValidateToken.dto';
import { AuthResetPasswordDTO } from './domain/dto/authResetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async generateJwtToken(user: User, expiresIn: string = '1d') {
    const payload = { sub: user.id, name: user.name };
    const options = {
      expiresIn,
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

  async forgotPassword({ email }: AuthForgotPasswordDTO) {
    const user = await this.userService.getUserByEmail(email);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const resetToken = await this.generateJwtToken(user, '30m');

    return resetToken;
  }

  async resetPassword({ token, password }: AuthResetPasswordDTO) {
    const { valid, decoded } = await this.validateToken(token);
    const teste = await this.validateToken(token);
    console.log('decoded', teste);
    if (!valid || !decoded) {
      throw new HttpException('Invalid token', HttpStatus.BAD_REQUEST);
    }

    const user = await this.userService.updateUser(Number(decoded.sub), {
      password: await bcrypt.hash(password, 10),
    });
    return this.generateJwtToken(user);
  }

  async validateToken(token: string): Promise<ValidateTokenDTO> {
    try {
      const decoded = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET,
        issuer: 'dnc_hotel',
      });

      return { valid: true, decoded };
    } catch (error) {
      return {
        valid: false,
        message: (error as Error).message,
        decoded: undefined,
      };
    }
  }
}
