import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { Hotel } from '@prisma/client';

@Injectable()
export class FindHotelsByOwnerService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
  ) {}

  async execute(ownerId: number): Promise<Hotel[]> {
    const hotels = await this.hotelRepositories.findHotelsByOwner(ownerId);
    if (hotels.length === 0) {
      throw new HttpException('Hotels not found', HttpStatus.NOT_FOUND);
    }
    return hotels;
  }
}
