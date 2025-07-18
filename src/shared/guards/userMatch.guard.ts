import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { User } from '@prisma/client';

interface RequestWithUser extends Request {
  user?: User;
  params: { id: string };
}

@Injectable()
export class UserMatchGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest<RequestWithUser>();
    const user = request.user;
    const params = request.params;

    if (user?.id !== Number(params.id)) {
      throw new HttpException('User does not match', HttpStatus.UNAUTHORIZED);
    }

    return true;
  }
}
