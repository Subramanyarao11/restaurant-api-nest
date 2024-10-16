import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import mongoose, { Model } from 'mongoose';
import { Query } from 'src/utils/type';

@Injectable()
export class RestaurantService {
  constructor(
    @InjectModel(Restaurant.name)
    private readonly restuarantModel: Model<Restaurant>,
  ) {}

  async findAll(query: Query): Promise<Restaurant[]> {
    const resultsPerPage = 5; // Hardcoded for now
    const currentPage = query.page ? Number(query.page) : 1;
    const skip = resultsPerPage * (currentPage - 1);
    const keyword = query.keyword
      ? {
          name: {
            $regex: query.keyword,
            $options: 'i',
          },
        }
      : {};
    return this.restuarantModel
      .find({ ...keyword })
      .limit(resultsPerPage)
      .skip(skip);
  }

  async create(restaurant: Restaurant): Promise<Restaurant> {
    return this.restuarantModel.create(restaurant);
  }

  async findOne(id: string): Promise<Restaurant> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) throw new BadRequestException('Invalid MongoDB id');
    const restaurant = await this.restuarantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return restaurant;
  }

  async update(id: string, restaurant: Restaurant): Promise<Restaurant> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) throw new BadRequestException('Invalid MongoDB id');
    const restaurantToUpdate = await this.restuarantModel.findById(id);
    if (!restaurantToUpdate)
      throw new NotFoundException('Restaurant not found');
    return this.restuarantModel.findByIdAndUpdate(id, restaurant);
  }

  async delete(id: string): Promise<Restaurant> {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) throw new BadRequestException('Invalid MongoDB id');
    const restaurant = await this.restuarantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    return this.restuarantModel.findByIdAndDelete(id);
  }
}
