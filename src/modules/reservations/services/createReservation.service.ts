import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { IReservationRepositories } from '../domain/repositories/Ireservation.repositories';
import { RESERVATION_REPOSITORY_TOKEN } from '../utils/repositoriesToken';
import { parseISO } from 'date-fns';
import { differenceInDays } from 'date-fns';
import { IHotelRepository } from 'src/modules/hotels/domain/repositories/Ihotel.repositories';
import { Reservation, ReservationStatus } from '@prisma/client';
import { HOTEL_REPOSITORY_TOKEN } from 'src/modules/hotels/utils/repositoriesTokens';

@Injectable()
export class CreateReservationService {
  constructor(
    @Inject(RESERVATION_REPOSITORY_TOKEN)
    private readonly reservationRepository: IReservationRepositories,
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepository: IHotelRepository,
  ) {}
  async execute(userId: number, data: CreateReservationDto) {
    const checkIn = parseISO(data.checkIn);
    const checkOut = parseISO(data.checkOut);
    const diffInDays = differenceInDays(checkOut, checkIn);
    if (checkIn >= checkOut) {
      throw new HttpException(
        'Check-in date must be before check-out date',
        HttpStatus.BAD_REQUEST,
      );
    }
    const hotel = await this.hotelRepository.findHotelById(data.hotelId);
    if (!hotel) {
      throw new HttpException('Hotel not found', HttpStatus.NOT_FOUND);
    }
    if (typeof hotel.price !== 'number' || hotel.price < 0) {
      throw new HttpException('Invalid hotel price', HttpStatus.BAD_REQUEST);
    }
    const total = diffInDays * hotel.price;
    const newReservation = {
      ...data,
      checkIn,
      checkOut,
      total,
      userId,
      status: ReservationStatus.PENDING,
    };
    return this.reservationRepository.createReservation(
      newReservation as Reservation,
    );
  }
}
