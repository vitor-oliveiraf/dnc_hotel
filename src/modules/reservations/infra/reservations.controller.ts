import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Patch,
  UseInterceptors,
} from '@nestjs/common';
import { CreateReservationService } from '../services/createReservation.service';
import { CreateReservationDto } from '../domain/dto/create-reservation.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { FindReservationsService } from '../services/findReservations.service';
import { FindReservationByIdService } from '../services/findReservationById.service';
import { FindReservationsByUserIdService } from '../services/findReservationsByUserId.service';
import { ReservationStatus } from '@prisma/client';
import { UpdateStatusReservationService } from '../services/UpdateStatusReservation.service';
import { UserDecorator } from '../../../shared/decorators/user.decorator';
import { Role } from '@prisma/client';
import { Roles } from '../../../shared/decorators/roles.decorator';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';

@UseGuards(AuthGuard)
@UseInterceptors(LoggingInterceptor)
@Controller('reservations')
export class ReservationsController {
  constructor(
    private readonly reservationsService: CreateReservationService,
    private readonly findReservationsService: FindReservationsService,
    private readonly findReservationByIdService: FindReservationByIdService,
    private readonly findReservationsByUserIdService: FindReservationsByUserIdService,
    private readonly updateStatusReservationService: UpdateStatusReservationService,
  ) {}

  @Roles(Role.USER)
  @Post()
  create(@UserDecorator('id') id: number, @Body() data: CreateReservationDto) {
    console.log('data::::::::', data);
    return this.reservationsService.execute(id, data);
  }

  @Get()
  findAll() {
    return this.findReservationsService.execute();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.findReservationByIdService.execute(id);
  }

  @Get('user')
  findReservationsByUserId(@UserDecorator('id') userId: number) {
    return this.findReservationsByUserIdService.execute(userId);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() status: ReservationStatus) {
    return this.updateStatusReservationService.execute(id, status);
  }
}
