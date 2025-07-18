import { Hotel } from '@prisma/client';
import { CreateHotelDto } from '../dto/create-hotel.dto';
import { UpdateHotelDto } from '../dto/update-hotel.dto';

export interface IHotelRepository {
  createHotel(data: CreateHotelDto, id: number): Promise<Hotel>;
  findHotelById(id: number): Promise<Hotel>;
  findHotelByName(name: string): Promise<Hotel | null>;
  findHotels(offset: number, limit: number): Promise<Hotel[]>;
  countHotels(): Promise<number>;
  findHotelsByOwner(ownerId: number): Promise<Hotel[]>;
  updateHotel(id: number, data: UpdateHotelDto): Promise<Hotel>;
  deleteHotel(id: number): Promise<Hotel>;
}
