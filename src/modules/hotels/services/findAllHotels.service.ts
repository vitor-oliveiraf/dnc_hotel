import { Inject, Injectable } from '@nestjs/common';
import { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { Hotel } from '@prisma/client';

@Injectable()
export class FindAllHotelsService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
  ) {}

  async execute(
    page: number = 1,
    limit: number = 10,
  ): Promise<{
    hotels: Hotel[];
    total: number;
    page: number;
    limit: number;
  }> {
    const offset = (page - 1) * limit;
    const hotels = await this.hotelRepositories.findHotels(offset, limit);
    const total = await this.hotelRepositories.countHotels();
    return {
      hotels,
      total,
      page,
      limit,
    };
  }
}
