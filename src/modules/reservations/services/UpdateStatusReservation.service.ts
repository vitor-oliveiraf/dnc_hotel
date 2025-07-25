import { Inject, Injectable } from '@nestjs/common';
import { IReservationRepositories } from '../domain/repositories/Ireservation.repositories';
import { RESERVATION_REPOSITORY_TOKEN } from '../utils/repositoriesToken';
import { ReservationStatus } from '@prisma/client';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../../users/user.services';
import { format } from 'date-fns';
import { HOTEL_REPOSITORY_TOKEN } from '../../hotels/utils/repositoriesTokens';
import { IHotelRepository } from '../../hotels/domain/repositories/IHotel.repositories';

@Injectable()
export class UpdateStatusReservationService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepository: IHotelRepository,
    @Inject(RESERVATION_REPOSITORY_TOKEN)
    private readonly reservationRepository: IReservationRepositories,
    private readonly mailService: MailerService,
    private readonly userService: UserService,
  ) {}

  async execute(id: number, status: ReservationStatus) {
    const reservation = await this.reservationRepository.updateReservation(
      id,
      status,
    );
    const user = await this.userService.showUser(reservation.userId);
    const hotel = await this.hotelRepository.findHotelById(reservation.hotelId);
    await this.mailService.sendMail({
      to: user.email,
      subject: 'Reservation status updated!',
      html: `
          <div>
            <h1>Reservation status updated!</h1>
            <p>The reservation status has been updated to ${status}</p>
            <p>Hotel: ${hotel.name}</p>
            <p>Check-in: ${format(reservation.checkIn, 'dd/MM/yyyy')}</p>
            <p>Check-out: ${format(reservation.checkOut, 'dd/MM/yyyy')}</p>
            <p>Total: ${reservation.total}</p>
          </div>
      `,
    });
    return reservation;
  }
}
