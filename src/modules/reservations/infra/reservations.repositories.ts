import { Injectable } from '@nestjs/common';
import { IReservationRepositories } from '../domain/repositories/Ireservation.repositories';
import { PrismaService } from '../../prisma/prisma.service';
import { Reservation, ReservationStatus } from '@prisma/client';

@Injectable()
export class ReservationsRepositories implements IReservationRepositories {
  constructor(private readonly prisma: PrismaService) {}

  createReservation(data: Reservation): Promise<Reservation> {
    return this.prisma.reservation.create({
      data,
    });
  }

  findReservationById(id: number): Promise<Reservation> {
    return this.prisma.reservation.findUnique({
      where: { id },
    });
  }

  findReservations(): Promise<Reservation[]> {
    return this.prisma.reservation.findMany();
  }

  findReservationsByUserId(userId: number): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: { userId },
    });
  }

  updateReservation(
    id: number,
    status: ReservationStatus,
  ): Promise<Reservation> {
    return this.prisma.reservation.update({
      where: { id },
      data: { status },
    });
  }
}
