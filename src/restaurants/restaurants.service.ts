import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Restaurant } from './schemas/restaurants.schema';
import mongoose, { Model } from 'mongoose';
import { Query } from 'src/utils/type';
import GeoCoder from 'src/utils/geoCoder';
import FileUpload from 'src/utils/fileUpload';
import { User } from 'src/auth/schemas/user.schema';

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

  async create(restaurant: Restaurant, user: User): Promise<Restaurant> {
    const location = await GeoCoder.getRestaurantLocation(restaurant.address);
    const newRestaurant = Object.assign(restaurant, {
      user: user._id,
      location,
    });
    return this.restuarantModel.create(newRestaurant);
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

  async uploadImages(id: string, files: any[]) {
    const isValid = mongoose.isValidObjectId(id);
    if (!isValid) throw new BadRequestException('Invalid MongoDB id');
    const restaurant = await this.restuarantModel.findById(id);
    if (!restaurant) throw new NotFoundException('Restaurant not found');
    const images = await FileUpload.upload(files);
    return await this.restuarantModel.findByIdAndUpdate(
      id,
      {
        images: images as Object[],
      },
      {
        new: true,
        runValidators: true,
      },
    );
  }

  async deleteImages(images: any[]) {
    if (images.length === 0) return true;
    const res = await FileUpload.deleteImages(images);
    return res;
  }
}
