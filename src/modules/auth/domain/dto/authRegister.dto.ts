import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from '../../../users/domain/dto/createUser.dto';

export class AuthRegisterDTO extends PartialType(CreateUserDto) {}
