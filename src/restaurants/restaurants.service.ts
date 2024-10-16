import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import { Model } from 'mongoose';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restuarantModel: Model<Restaurant>,
  ) {}

  async findAll(): Promise<Restaurant[]> {
    return this.restuarantModel.find();
  }

  async create(restaurant: Restaurant): Promise<Restaurant> {
    return this.restuarantModel.create(restaurant);
  }

  async findOne(id: string): Promise<Restaurant> {
    const restaurant = await this.restuarantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async update(id: string, restaurant: Restaurant): Promise<Restaurant> {
    const restaurantToUpdate = await this.restuarantModel.findById(id);
    if (!restaurantToUpdate)
      throw new NotFoundException('Restaurant not found');
    return this.restuarantModel.findByIdAndUpdate(id, restaurant);
  }

  async delete(id: string): Promise<Restaurant> {
    const restaurant = await this.restuarantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return this.restuarantModel.findByIdAndDelete(id);
  }
}
