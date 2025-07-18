import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import { HOTEL_REPOSITORY_TOKEN } from '../utils/repositoriesTokens';
import { join } from 'path';
import { stat, unlink } from 'fs/promises';
import { resolve } from 'path';

@Injectable()
export class UpdateImageHotelService {
  constructor(
    @Inject(HOTEL_REPOSITORY_TOKEN)
    private readonly hotelRepositories: IHotelRepository,
  ) {}

  async execute(id: number, image: Express.Multer.File) {
    const hotel = await this.hotelRepositories.findHotelById(id);
    if (!hotel) {
      throw new HttpException('Hotel not found', HttpStatus.NOT_FOUND);
    }
    if (hotel.image) {
      const directory = resolve(
        __dirname,
        '..',
        '..',
        '..',
        '..',
        'uploads-hotels',
      );
      const imageHotelFilePath = join(directory, hotel.image);
      try {
        const imageHotelFileExists = await stat(imageHotelFilePath);
        if (imageHotelFileExists) {
          await unlink(imageHotelFilePath);
        }
      } catch {
        // File doesn't exist, ignore error
      }
    }
    return await this.hotelRepositories.updateHotel(id, {
      image: image.filename,
    });
  }
}
