import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { MealService } from './meal.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { Meal } from '@prisma/client';
import { CreateMealDto } from './dto/create-meal.dto';

@Controller('meals')
export class MealController {
  constructor(private readonly mealService: MealService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getMeals(@CurrentUser('id') userId: string): Promise<Meal[]> {
    return this.mealService.getMeals(userId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getMeal(@Param('id') id: string): Promise<Meal> {
    return this.mealService.getMeal(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createMeal(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateMealDto,
  ): Promise<Meal> {
    return this.mealService.createMeal(dto, userId);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateMeal(
    @Param('id') id: string,
    @Body() dto: CreateMealDto,
  ): Promise<Meal> {
    return this.mealService.updateMeal(id, dto);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteMeal(@Param('id') id: string): Promise<void> {
    return this.mealService.deleteMeal(id);
  }
}
