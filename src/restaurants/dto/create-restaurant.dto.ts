import {
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  IsEmpty,
} from 'class-validator';
import { User } from 'src/auth/schemas/user.schema';
import { Category } from '../schemas/restaurants.schema';

export class CreateRestaurantDto {
  @IsNotEmpty()
  @IsString()
  readonly name: string;

  @IsNotEmpty()
  @IsString()
  readonly description: string;

  @IsNotEmpty()
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  @IsString()
  readonly address: string;

  @IsNotEmpty()
  @IsPhoneNumber('IN', {
    message: 'Invalid phone number, must be an Indian number',
  })
  readonly phone: number;

  @IsNotEmpty()
  @IsEnum(Category, { message: 'Invalid category' })
  readonly category: Category;

  @IsEmpty({ message: 'User is required' })
  readonly user: User;
}
