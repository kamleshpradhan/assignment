/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import {HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required:true,unique:true})
  id: number; 
  @Prop()
  name: string;
  @Prop()
  age: number;
  @Prop({required:true,unique:true})
  email: string;
  @Prop()
  phone: string;
  @Prop()
  postalCode: string;
  @Prop()
  createdAt: Date;
  @Prop()
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);


