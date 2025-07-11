import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const ParamId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const id = request.params.id;

    return Number(id);
  },
);
