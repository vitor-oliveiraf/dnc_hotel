import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { UserService } from './user.services';
import { $Enums } from 'generated/prisma';

interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role: $Enums.Role;
}

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  listUsers() {
    return this.userService.listUsers();
  }

  @Get(':id')
  showUser(@Param('id') id: string) {
    return this.userService.showUser(Number(id));
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Patch(':id')
  updateUser(@Param('id') id: string, @Body() body: CreateUserDto) {
    return this.userService.updateUser(Number(id), body);
  }

  @Delete(':id')
  deleteUser(@Param('id') id: string) {
    return this.userService.deleteUser(Number(id));
  }
}
