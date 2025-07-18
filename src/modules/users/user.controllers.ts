import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  UseInterceptors,
  Post,
  UseGuards,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { ParamId } from '../../shared/decorators/paramId.decorator';
import { UserService } from './user.services';
import { CreateUserDto } from './domain/dto/createUser.dto';
import { UpdateUserDto } from './domain/dto/updateUser.dto';
import { LoggingInterceptor } from '../../shared/interceptors/logging.interceptor';
import { AuthGuard } from '../../shared/guards/auth.guard';
import { UserDecorator } from '../../shared/decorators/user.decorator';
import { Role, User as UserType } from '@prisma/client';
import { RoleGuard } from '../../shared/guards/role.guard';
import { Roles } from '../../shared/decorators/roles.decorator';
import { UserMatchGuard } from '../../shared/guards/userMatch.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileValidationInterceptor } from '../../shared/interceptors/fileValidation.interceptor';

@UseGuards(AuthGuard, RoleGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  listUsers(@UserDecorator('email') user: UserType) {
    console.log('decorator user', user);
    return this.userService.listUsers();
  }

  @Get(':id')
  showUser(@ParamId() id: number) {
    return this.userService.showUser(id);
  }

  @Roles(Role.ADMIN)
  @Post()
  createUser(@Body() body: CreateUserDto) {
    return this.userService.createUser(body);
  }

  @UseGuards(UserMatchGuard)
  @Patch(':id')
  updateUser(@ParamId() id: number, @Body() body: UpdateUserDto) {
    return this.userService.updateUser(id, body);
  }

  @UseGuards(UserMatchGuard)
  @Delete(':id')
  deleteUser(@ParamId() id: number) {
    return this.userService.deleteUser(id);
  }

  @UseInterceptors(FileInterceptor('avatar'), FileValidationInterceptor)
  @Post('upload-avatar')
  uploadAvatar(
    @UserDecorator('id') userId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 }),
          new FileTypeValidator({
            fileType: 'image/*',
          }),
        ],
      }),
    )
    avatar: Express.Multer.File,
  ) {
    return this.userService.updateAvatar(userId, avatar);
  }
}
