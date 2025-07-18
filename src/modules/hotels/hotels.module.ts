import { Module } from '@nestjs/common';
import { HotelsController } from './infra/hotels.controller';
import { HotelsRepositories } from './infra/hotels.repositories';
import { CreateHotelService } from './services/createHotel.service';
import { FindAllHotelsService } from './services/findAllHotels.service';
import { FindOneHotelService } from './services/findOneHotel.service';
import { RemoveHotelService } from './services/removeHotel.service';
import { UpdateHotelService } from './services/updateHotel.service';
import { PrismaModule } from '../prisma/prisma.module';
import { HOTEL_REPOSITORY_TOKEN } from './utils/repositoriesTokens';
import { FindHotelByNameService } from './services/findHotelByName.service';
import { FindHotelsByOwnerService } from './services/findHotelsByOwner.service';
import { AuthModule } from '../auth/auth.module';
import { UserModule } from '../users/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { UpdateImageHotelService } from './services/updateImageHotel.service';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    UserModule,
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads-hotels',
        filename: (req, file, cb) => {
          const filename = `${Date.now()}-${randomUUID()}-${file.originalname}`;
          cb(null, filename);
        },
      }),
    }),
  ],
  controllers: [HotelsController],
  providers: [
    CreateHotelService,
    FindAllHotelsService,
    FindHotelByNameService,
    FindHotelsByOwnerService,
    FindOneHotelService,
    RemoveHotelService,
    UpdateHotelService,
    UpdateImageHotelService,
    {
      provide: HOTEL_REPOSITORY_TOKEN,
      useClass: HotelsRepositories,
    },
  ],
})
export class HotelsModule {}
