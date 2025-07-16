import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from 'generated/prisma';
import { CreateUserDto } from './domain/dto/createUser.dto';
import { UpdateUserDto } from './domain/dto/updateUser.dto';
import * as bcrypt from 'bcrypt';
import { useSelectFields } from '../prisma/utils/useSelectFields';
import { join, resolve } from 'path';
import { stat, unlink } from 'fs/promises';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  //   List all users
  async listUsers(): Promise<User[]> {
    return await this.prisma.user.findMany({
      select: useSelectFields,
    });
  }

  //   Show a user
  async showUser(id: number): Promise<User> {
    return await this.isIdExists(id);
  }

  //   Create a user
  async createUser(body: CreateUserDto): Promise<User> {
    await this.isEmailExists(body.email);
    const hashedPassword = await this.hashPassword(body.password);
    return this.prisma.user.create({
      data: { ...body, password: hashedPassword },
      select: useSelectFields,
    });
  }

  //   Update a user
  async updateUser(id: number, body: UpdateUserDto): Promise<User> {
    await this.isIdExists(id);

    if (body.email) {
      await this.isEmailExists(body.email);
    }

    if (body.password) {
      body.password = await this.hashPassword(body.password);
    }

    return this.prisma.user.update({
      where: { id },
      data: body,
      select: useSelectFields,
    });
  }

  //   Update the user avatar
  async updateAvatar(id: number, avatar: Express.Multer.File) {
    const user = await this.isIdExists(id);
    const directory = resolve(__dirname, '..', '..', '..', 'uploads');

    if (user.avatar && user.avatar !== '') {
      const userAvatarFilePath = join(directory, user.avatar);
      try {
        const userAvatarFileExists = await stat(userAvatarFilePath);
        if (userAvatarFileExists) {
          await unlink(userAvatarFilePath);
        }
      } catch {
        // File doesn't exist, ignore error
      }
    }

    const userUpdated = await this.updateUser(id, { avatar: avatar.filename });

    return userUpdated;
  }

  //   Delete a user
  async deleteUser(id: number): Promise<User> {
    await this.isIdExists(id);
    return this.prisma.user.delete({ where: { id }, select: useSelectFields });
  }

  //   Get a user by email
  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  //   Check if the user exists
  private async isIdExists(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: useSelectFields,
    });

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

  //   Hash the password
  private async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
  }
}
