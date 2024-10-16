import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { Category } from '../schemas/restaurants.schema';

export class UpdateRestaurantDto {
  @IsOptional()
  @IsString()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description: string;

  @IsOptional()
  @IsEmail()
  readonly email: string;

  @IsOptional()
  @IsString()
  readonly address: string;

  @IsOptional()
  @IsPhoneNumber('IN', {
    message: 'Invalid phone number, must be an Indian number',
  })
  readonly phone: number;

  @IsOptional()
  @IsEnum(Category, { message: 'Invalid category' })
  readonly category: Category;
}
