import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateMealDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsArray()
  ingredients: string[];
}
