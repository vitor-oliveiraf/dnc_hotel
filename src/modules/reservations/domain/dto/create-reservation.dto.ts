import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ReservationStatus } from '@prisma/client';
import { Transform } from 'class-transformer';

export class CreateReservationDto {
  @IsNumber()
  @IsNotEmpty()
  hotelId: number;

  @IsString()
  @IsNotEmpty()
  checkIn: string;

  @IsString()
  @IsNotEmpty()
  checkOut: string;

  @IsEnum(ReservationStatus)
  @IsOptional()
  @Transform(
    ({ value }): ReservationStatus => value ?? ReservationStatus.PENDING,
  )
  status: ReservationStatus;
}
