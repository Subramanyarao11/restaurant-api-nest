import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  ForbiddenException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RestaurantService } from './restaurants.service';
import { Restaurant } from './schemas/restaurants.schema';
import { CreateRestaurantDto } from './dto/create-restaurant.dto';
import { UpdateRestaurantDto } from './dto/update-restaurant.dto';
import { Query as ExpressQuery } from 'src/utils/type';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { CurrentUser } from 'src/auth/decorators/current-user.decorator';
import { User } from 'src/auth/schemas/user.schema';

@Controller('restaurants')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  @Get()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin', 'user')
  async findAll(@Query('category') query: ExpressQuery): Promise<Restaurant[]> {
    return this.restaurantService.findAll(query);
  }

  @Post()
  @UseGuards(AuthGuard(), RolesGuard)
  @Roles('admin')
  async create(@Body() restaurant: CreateRestaurantDto, @CurrentUser() user) {
    return this.restaurantService.create(restaurant, user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<Restaurant> {
    return this.restaurantService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard())
  async update(
    @Param('id') id: string,
    @Body() restaurant: UpdateRestaurantDto,
    @CurrentUser() user,
  ): Promise<Restaurant> {
    const res = await this.restaurantService.findOne(id);
    if (res.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not update this restaurant.');
    }

    return this.restaurantService.update(id, restaurant);
  }

  @Delete(':id')
  @UseGuards(AuthGuard())
  async delete(
    @Param('id') id: string,
    @CurrentUser() user: User,
  ): Promise<{ deleted: Boolean }> {
    const restaurant = await this.restaurantService.findOne(id);

    if (restaurant.user.toString() !== user._id.toString()) {
      throw new ForbiddenException('You can not delete this restaurant.');
    }

    const isDeletedImages = await this.restaurantService.deleteImages(
      restaurant.images,
    );

    if (isDeletedImages) {
      this.restaurantService.delete(id);
      return { deleted: true };
    } else {
      return { deleted: false };
    }
  }

  @Put('upload/:id')
  @UseGuards(AuthGuard())
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFiles(
    @Param('id') id: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    await this.restaurantService.findOne(id);
    const res = await this.restaurantService.uploadImages(id, files);
    return res;
  }
}
