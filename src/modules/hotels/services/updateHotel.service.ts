import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { InjectRedis } from '@nestjs-modules/ioredis';
import Redis from 'ioredis';
import { HOTELS_KEY } from '../utils/redisKey';

@Injectable()
export class UpdateHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async execute(id: number, updateHotelDto: UpdateHotelDto) {
    await this.redis.del(HOTELS_KEY);
    const hotel = await this.hotelRepositories.updateHotel(id, updateHotelDto);
    if (!hotel) {
      throw new HttpException('Hotel not found', HttpStatus.NOT_FOUND);
    }
    return hotel;
  }
}
