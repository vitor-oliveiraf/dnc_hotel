import { Inject, Injectable } from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import { Hotel } from '@prisma/client';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { HOTELS_KEY } from '../utils/redisKey';

@Injectable()
export class CreateHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async execute(createHotelDto: CreateHotelDto, id: number): Promise<Hotel> {
    await this.redis.del(HOTELS_KEY);
    return await this.hotelRepositories.createHotel(createHotelDto, id);
  }
}
