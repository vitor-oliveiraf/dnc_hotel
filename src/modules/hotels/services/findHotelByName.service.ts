import { Inject, Injectable } from '@nestjs/common';
import { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { Hotel } from '@prisma/client';

@Injectable()
export class FindHotelByNameService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
  ) {}

  async execute(name: string): Promise<Hotel | null> {
    return await this.hotelRepositories.findHotelByName(name);
  }
}
