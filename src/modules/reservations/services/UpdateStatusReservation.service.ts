import { Inject, Injectable } from '@nestjs/common';
import { IReservationRepositories } from '../domain/repositories/Ireservation.repositories';
import { RESERVATION_REPOSITORY_TOKEN } from '../utils/repositoriesToken';
import { ReservationStatus } from '@prisma/client';

@Injectable()
export class UpdateStatusReservationService {
  constructor(
    @Inject(RESERVATION_REPOSITORY_TOKEN)
    private readonly reservationRepository: IReservationRepositories,
  ) {}

  async execute(id: number, status: ReservationStatus) {
    return this.reservationRepository.updateReservation(id, status);
  }
}
