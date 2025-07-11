import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'generated/prisma';
import { CreateUserDto } from './domain/dto/createUser.dto';
import { UpdateUserDto } from './domain/dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //   List all users
  async listUsers(): Promise<User[]> {
    return await this.prisma.user.findMany();
  }

  //   Show a user
  async showUser(id: number): Promise<User | null> {
    const user = await this.isIdExists(id);
    return user;
  }

  //   Create a user
  async createUser(body: CreateUserDto): Promise<User> {
    await this.isEmailExists(body.email);
    return this.prisma.user.create({ data: body });
  }

  //   Update a user
  async updateUser(id: number, body: UpdateUserDto): Promise<User> {
    await this.isIdExists(id);

    if (body.email) {
      await this.isEmailExists(body.email);
    }

    return this.prisma.user.update({ where: { id }, data: body });
  }

  //   Delete a user
  async deleteUser(id: number): Promise<User> {
    await this.isIdExists(id);

    return this.prisma.user.delete({ where: { id } });
  }

  //   Check if the user exists
  private async isIdExists(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  //   Check if the email exists
  private async isEmailExists(email: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    if (user) {
      throw new HttpException('Email already in use', HttpStatus.CONFLICT);
    }

    return !!user;
  }
}
