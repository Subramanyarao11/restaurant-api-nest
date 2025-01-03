import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurants.controller';
import { RestaurantService } from './restaurants.service';
import { AuthModule } from 'src/auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurantchema } from './schemas/restaurants.schema';

@Module({
  imports: [
    AuthModule,
    MongooseModule.forFeature([
      {
        name: 'Restaurant',
        schema: Restaurantchema,
      },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
  exports: [MongooseModule],
})
export class RestaurantModule {}
