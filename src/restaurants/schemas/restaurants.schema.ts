import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import { Location } from './location.schema';
import { User } from 'src/auth/schemas/user.schema';

export type RestuarantDocument = Restaurant & Document;

export enum Category {
  FAST_FOOD = 'Fast food',
  CAFE = 'Cafe',
  FINE_DINING = 'Fine dining',
}

@Schema()
export class Restaurant {
  @Prop()
  name: string;

  @Prop()
  description: string;

  @Prop()
  images?: object[];

  @Prop()
  address: string;

  @Prop()
  phone: number;

  @Prop()
  email: string;

  @Prop()
  category: Category;

  @Prop({ type: Object, ref: 'Location' })
  location?: Location;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user: User;
}

export const Restaurantchema = SchemaFactory.createForClass(Restaurant);
