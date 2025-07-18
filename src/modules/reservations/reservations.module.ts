import { Module } from '@nestjs/common';
import { CreateReservationService } from './services/createReservation.service';
import { ReservationsController } from './infra/reservations.controller';
import { HotelsModule } from '../hotels/hotels.module';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { PrismaModule } from '../prisma/prisma.module';
import { ReservationsRepositories } from './infra/reservations.repositories';
import { RESERVATION_REPOSITORY_TOKEN } from './utils/repositoriesToken';
import { HotelsRepositories } from '../hotels/infra/hotels.repositories';
import { HOTEL_REPOSITORY_TOKEN } from '../hotels/utils/repositoriesTokens';
import { FindReservationsService } from './services/findReservations.service';
import { FindReservationByIdService } from './services/findReservationById.service';
import { FindReservationsByUserIdService } from './services/findReservationsByUserId.service';
import { UpdateStatusReservationService } from './services/UpdateStatusReservation.service';

@Module({
  imports: [PrismaModule, HotelsModule, AuthModule, UserModule],
  controllers: [ReservationsController],
  providers: [
    CreateReservationService,
    FindReservationsService,
    FindReservationByIdService,
    FindReservationsByUserIdService,
    UpdateStatusReservationService,
    {
      provide: RESERVATION_REPOSITORY_TOKEN,
      useClass: ReservationsRepositories,
    },
    {
      provide: HOTEL_REPOSITORY_TOKEN,
      useClass: HotelsRepositories,
    },
  ],
})
export class ReservationsModule {}
