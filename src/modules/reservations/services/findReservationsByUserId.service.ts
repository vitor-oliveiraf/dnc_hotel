import { Inject, Injectable } from '@nestjs/common';
import { IReservationRepositories } from '../domain/repositories/Ireservation.repositories';
import { RESERVATION_REPOSITORY_TOKEN } from '../utils/repositoriesToken';

@Injectable()
export class FindReservationsByUserIdService {
  constructor(
    @Inject(RESERVATION_REPOSITORY_TOKEN)
    private readonly reservationRepository: IReservationRepositories,
  ) {}

  async execute(userId: number) {
    return this.reservationRepository.findReservationsByUserId(userId);
  }
}
