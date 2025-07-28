import { Inject, Injectable } from '@nestjs/common';
import { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { Hotel } from '@prisma/client';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { HOTELS_KEY } from '../utils/redisKey';

@Injectable()
export class FindAllHotelsService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
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

    const dataRedis = await this.redis.get(HOTELS_KEY);

    let data = JSON.parse(dataRedis) as Hotel[];

    if (!data) {
      data = await this.hotelRepositories.findHotels(offset, limit);
      await this.redis.set(HOTELS_KEY, JSON.stringify(data));
    }

    const total = await this.hotelRepositories.countHotels();
    return {
      hotels: data,
      total,
      page,
      limit,
    };
  }
}
