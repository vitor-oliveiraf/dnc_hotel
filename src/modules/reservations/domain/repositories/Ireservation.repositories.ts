import { Reservation, ReservationStatus } from '@prisma/client';
import { CreateReservationDto } from '../dto/create-reservation.dto';
export interface IReservationRepositories {
  create(data: CreateReservationDto): Promise<Reservation>;
  findReservationById(id: number): Promise<Reservation>;
  findReservations(): Promise<Reservation[]>;
  findReservationsByUserId(userId: number): Promise<Reservation[]>;
  updateReservation(
    id: number,
    status: ReservationStatus,
  ): Promise<Reservation>;
}
