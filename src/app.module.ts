import { Module } from '@nestjs/common';
import { PrismaModule } from './modules/prisma/prisma.module';
import { UserModule } from './modules/users/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { HotelsModule } from './modules/hotels/hotels.module';

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
    MailerModule.forRoot({
      transport: process.env.SMTP,
      defaults: {
        from: `"dnc_hotels" <${process.env.EMAIL_USER}>`,
      },
    }),
    HotelsModule,
  ],
})
export class AppModule {}
