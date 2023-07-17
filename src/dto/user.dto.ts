/* eslint-disable prettier/prettier */
import { IsString, IsNumber, IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsNumber()
  age: string;

  @IsEmail()
  email: string;

  @IsString()
  phone: string;

  @IsString()
  postalCode: string;
}
