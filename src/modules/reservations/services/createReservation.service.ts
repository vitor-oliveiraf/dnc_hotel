import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { IReservationRepositories } from '../domain/repositories/Ireservation.repositories';
import { RESERVATION_REPOSITORY_TOKEN } from '../utils/repositoriesToken';
import { format, parseISO } from 'date-fns';
import { differenceInDays } from 'date-fns';
import { IHotelRepository } from 'src/modules/hotels/domain/repositories/Ihotel.repositories';
import { ReservationStatus } from '@prisma/client';
import { HOTEL_REPOSITORY_TOKEN } from 'src/modules/hotels/utils/repositoriesTokens';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from 'src/modules/users/user.services';

@Injectable()
export class CreateReservationService {
  constructor(
    @Inject(RESERVATION_REPOSITORY_TOKEN)
    private readonly reservationRepository: IReservationRepositories,
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepository: IHotelRepository,
    private readonly mailService: MailerService,
    private readonly userService: UserService,
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
      checkIn: checkIn.toISOString(),
      checkOut: checkOut.toISOString(),
      total,
      userId,
      hotelId: hotel.id,
      status: ReservationStatus.PENDING,
    };
    const user = await this.userService.showUser(hotel.ownerId);
    await this.mailService.sendMail({
      to: user.email,
      subject: 'New reservation pending!',
      html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
              <div style="background-color: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">        
                  <div style="text-align: center; margin-bottom: 30px;">
                      <h1 style="color: #333; margin-bottom: 10px;">🏨 Confirmação de Reserva</h1>
                      <div style="background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 8px; border: 1px solid #ffeaa7;">
                          <strong>⏳ Reserva Pendente</strong>
                      </div>
                  </div>
                  <div style="margin-bottom: 25px;">
                      <p style="color: #666; font-size: 16px; margin-bottom: 15px;">
                          Olá <strong>${user.name}</strong>,
                      </p>
                      <p style="color: #666; font-size: 16px; line-height: 1.5;">
                          Recebemos sua solicitação de reserva e ela está sendo processada. 
                          Você receberá uma confirmação em breve.
                      </p>
                  </div>
                  <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                      <h3 style="color: #333; margin-bottom: 15px;">📋 Detalhes da Reserva</h3>
                      <div style="margin-bottom: 10px;">
                          <strong style="color: #555;">Check-in:</strong> 
                          <span style="color: #333;">${format(checkIn, 'dd/MM/yyyy')}</span>
                      </div>
                      <div style="margin-bottom: 10px;">
                          <strong style="color: #555;">Check-out:</strong> 
                          <span style="color: #333;">${format(checkOut, 'dd/MM/yyyy')}</span>
                      </div>
                      <div style="margin-bottom: 10px;">
                          <strong style="color: #555;">Hotel:</strong> 
                          <span style="color: #333;">${hotel.name}</span>
                      </div>
                  </div>
              </div>
          </div>
      `,
    });

    return this.reservationRepository.create(newReservation);
  }
}
