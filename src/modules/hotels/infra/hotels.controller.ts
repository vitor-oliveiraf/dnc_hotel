import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  UseInterceptors,
} from '@nestjs/common';
import { CreateHotelDto } from '../domain/dto/create-hotel.dto';
import { CreateHotelService } from '../services/createHotel.service';
import { FindAllHotelsService } from '../services/findAllHotels.service';
import { FindHotelByNameService } from '../services/findHotelByName.service';
import { FindHotelsByOwnerService } from '../services/findHotelsByOwner.service';
import { FindOneHotelService } from '../services/findOneHotel.service';
import { RemoveHotelService } from '../services/removeHotel.service';
import { UpdateHotelService } from '../services/updateHotel.service';
import { UpdateHotelDto } from '../domain/dto/update-hotel.dto';
import { OwnerHotelGuard } from 'src/shared/guards/ownerHotel.guard';
import { AuthGuard } from 'src/shared/guards/auth.guard';
import { RoleGuard } from 'src/shared/guards/role.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Role } from '@prisma/client';
import { UserDecorator } from 'src/shared/decorators/user.decorator';
import { UpdateImageHotelService } from '../services/updateImageHotel.service';
import { FileValidationInterceptor } from 'src/shared/interceptors/fileValidation.interceptor';
import { FileInterceptor } from '@nestjs/platform-express';

@UseGuards(AuthGuard, RoleGuard)
@Controller('hotels')
export class HotelsController {
  constructor(
    private readonly createHotelService: CreateHotelService,
    private readonly findAllHotelsService: FindAllHotelsService,
    private readonly findOneHotelService: FindOneHotelService,
    private readonly findHotelByNameService: FindHotelByNameService,
    private readonly findHotelsByOwnerService: FindHotelsByOwnerService,
    private readonly removeHotelService: RemoveHotelService,
    private readonly updateHotelService: UpdateHotelService,
    private readonly updateImageHotelService: UpdateImageHotelService,
  ) {}

  @Roles(Role.ADMIN)
  @UseGuards(RoleGuard)
  @Post()
  create(
    @UserDecorator('id') id: number,
    @Body() createHotelDto: CreateHotelDto,
  ) {
    return this.createHotelService.execute(createHotelDto, id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get()
  findAll(
    @Query('page') page: string = '1',
    @Query('limit') limit: string = '10',
  ) {
    return this.findAllHotelsService.execute(Number(page), Number(limit));
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.findOneHotelService.execute(id);
  }

  @Roles(Role.ADMIN, Role.USER)
  @Get('name')
  findHotelByName(@Query('name') name: string) {
    return this.findHotelByNameService.execute(name);
  }

  @Roles(Role.ADMIN)
  @Get('owner/:ownerId')
  findHotelsByOwner(@Param('ownerId') ownerId: number) {
    return this.findHotelsByOwnerService.execute(ownerId);
  }

  @UseInterceptors(FileInterceptor('image'), FileValidationInterceptor)
  @Patch('upload-image/:hotelId')
  uploadImage(
    @Param('hotelId') hotelId: number,
    @UploadedFile(
      new ParseFilePipe({
        validators: [new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 5 })],
      }),
    )
    image: Express.Multer.File,
  ) {
    return this.updateImageHotelService.execute(hotelId, image);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Patch(':id')
  update(@Param('id') id: number, @Body() updateHotelDto: UpdateHotelDto) {
    return this.updateHotelService.execute(id, updateHotelDto);
  }

  @UseGuards(OwnerHotelGuard)
  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.removeHotelService.execute(id);
  }
}
