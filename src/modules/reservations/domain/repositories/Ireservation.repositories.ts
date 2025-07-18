import { Reservation, ReservationStatus } from '@prisma/client';

export interface IReservationRepositories {
  createReservation(data: Reservation): Promise<Reservation>;
  findReservationById(id: number): Promise<Reservation>;
  findReservations(): Promise<Reservation[]>;
  findReservationsByUserId(userId: number): Promise<Reservation[]>;
  updateReservation(
    id: number,
    status: ReservationStatus,
  ): Promise<Reservation>;
}
