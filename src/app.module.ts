import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

@Module({
  imports: [
    PrismaModule,
    UserModule,
    AuthModule,
    //   ThrottlerModule.forRoot([
    //     {
    //       ttl: 5000,
    //       limit: 5,
    //     },
    //   ]),
    // ],
    // providers: [
    //   {
    //     provide: APP_GUARD,
    //     useClass: ThrottlerGuard,
    //   },
  ],
})
export class AppModule {}
