import { Inject, Injectable } from '@nestjs/common';
import { IReservationRepositories } from '../domain/repositories/Ireservation.repositories';
import { RESERVATION_REPOSITORY_TOKEN } from '../utils/repositoriesToken';

@Injectable()
export class FindReservationByIdService {
  constructor(
    @Inject(RESERVATION_REPOSITORY_TOKEN)
    private readonly reservationRepository: IReservationRepositories,
  ) {}

  async execute(id: number) {
    return this.reservationRepository.findReservationById(id);
  }
}
