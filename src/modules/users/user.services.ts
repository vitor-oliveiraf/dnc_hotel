import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums, User } from 'generated/prisma';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: $Enums.Role;
}

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async listUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  async showUser(id: number): Promise<User | null> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async createUser(body: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { email: body.email },
    });

    if (user) {
      throw new HttpException('User already exists', HttpStatus.CONFLICT);
    }

    return this.prisma.user.create({ data: body });
  }

  async updateUser(id: number, body: CreateUserDto): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    if (body.email) {
      const validateEmailExists = await this.prisma.user.findUnique({
        where: { email: body.email },
      });

      if (validateEmailExists) {
        throw new HttpException('Email already in use', HttpStatus.CONFLICT);
      }
    }

    return this.prisma.user.update({ where: { id }, data: body });
  }

  async deleteUser(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return this.prisma.user.delete({ where: { id } });
  }
}
