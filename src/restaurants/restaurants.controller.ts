import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { RestaurantService } from './restaurants.service';
import { Restaurant } from './schemas/restaurants.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Query as ExpressQuery } from 'src/utils/type';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  async findAll(@Query('category') query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantService.findAll(query);
  }

  @Post()
  async create(@Body() restaurant: CreateRestaurantDto): Promise<Restaurant> {
    return this.restaurantService.create(restaurant);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDto,
  ): Promise<Restaurant> {
    return this.restaurantService.update(id, restaurant);
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantService.delete(id);
  }
}
