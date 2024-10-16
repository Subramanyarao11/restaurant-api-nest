import { Category } from '../schemas/restaurants.schema';

export class UpdateRestaurantDto {
  readonly name: string;
  readonly description: string;
  readonly email: string;
  readonly address: string;
  readonly phone: number;
  readonly category: Category;
}
