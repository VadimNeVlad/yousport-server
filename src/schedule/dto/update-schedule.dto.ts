import { Meal, Workout } from '@prisma/client';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class UpdateScheduleDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsOptional()
  meals: Meal[];

  @IsNotEmpty()
  @IsOptional()
  workouts: Workout[];
}
