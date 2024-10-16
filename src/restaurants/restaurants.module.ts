import { Module } from '@nestjs/common';
import { RestaurantController } from './restaurants.controller';
import { RestaurantService } from './restaurants.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Restaurantchema } from './schemas/restaurants.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: 'Restaurant',
        schema: Restaurantchema,
      },
    ]),
  ],
  controllers: [RestaurantController],
  providers: [RestaurantService],
})
export class RestaurantModule {}
