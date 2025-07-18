import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { IHotelRepository } from '../domain/repositories/Ihotel.repositories';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { Hotel } from '@prisma/client';

@Injectable()
export class HotelsRepositories implements IHotelRepository {
  constructor(private readonly prisma: PrismaService) {}

  createHotel(data: CreateHotelDto, id: number): Promise<Hotel> {
    data.ownerId = id;
    return this.prisma.hotel.create({ data });
  }

  findHotelById(id: number): Promise<Hotel | null> {
    return this.prisma.hotel.findUnique({ where: { id: Number(id) } });
  }

  findHotelByName(name: string): Promise<Hotel | null> {
    return this.prisma.hotel.findFirst({
      where: {
        name: {
          contains: name,
          mode: 'insensitive',
        },
      },
    });
  }

  findHotels(offset: number, limit: number): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({
      skip: offset,
      take: limit,
      include: { owner: true },
    });
  }

  countHotels(): Promise<number> {
    return this.prisma.hotel.count();
  }

  findHotelsByOwner(ownerId: number): Promise<Hotel[]> {
    return this.prisma.hotel.findMany({ where: { ownerId: Number(ownerId) } });
  }

  updateHotel(id: number, data: UpdateHotelDto): Promise<Hotel> {
    return this.prisma.hotel.update({ where: { id: Number(id) }, data });
  }

  deleteHotel(id: number): Promise<Hotel> {
    return this.prisma.hotel.delete({ where: { id: Number(id) } });
  }
}
