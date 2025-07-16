import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { unlink } from 'fs';
import { Request } from 'express';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable()
export class FileValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((err) => {
        if (err instanceof BadRequestException) {
          const request = context.switchToHttp().getRequest<Request>();
          const file = request.file as Express.Multer.File;
          if (file) {
            unlink(file.path, (unlinkError) => {
              if (unlinkError)
                console.error('Erro ao remover o arquivo:', unlinkError);
            });
          }
        }

        return throwError(() => err as Error);
      }),
    );
  }
}
