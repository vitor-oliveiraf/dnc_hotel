import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    const now = Date.now();
    return next.handle().pipe(
      tap(() => {
        const request = context.switchToHttp().getRequest<Request>();
        console.log('-----Nova requisição-----');
        console.log('Method: ', request.method);
        console.log('URL: ', request.url);
        console.log('Body: ', request.body);
        console.log(`After... ${Date.now() - now}ms`);
      }),
    );
  }
}
