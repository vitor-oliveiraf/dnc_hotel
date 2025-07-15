import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthService } from '../../modules/auth/auth.service';
import { UserService } from '../../modules/users/user.services';
import { Request } from 'express';

interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const { authorization } = request.headers;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const tokenValue = authorization.split(' ')[1];

    const { valid, decoded } = await this.authService.validateToken(tokenValue);

    if (!valid || !decoded) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    const user = await this.userService.showUser(Number(decoded.sub));

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    request.user = user;

    return true;
  }
}
