import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { ParamId } from '../../shared/decorators/paramId.decorator';
import { UserService } from './user.services';
import { CreateUserDto } from './domain/dto/createUser.dto';
import { UpdateUserDto } from './domain/dto/updateUser.dto';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';

@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  listUsers() {
    return this.userService.listUsers();
  }

  @Get(':id')
  showUser(@ParamId() id: number) {
    return this.userService.showUser(id);
  }

  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @Patch(':id')
  updateUser(@ParamId() id: number, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }

  @Delete(':id')
  deleteUser(@ParamId() id: number) {
    return this.userService.deleteUser(id);
  }
}
