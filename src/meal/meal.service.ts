import { Injectable, NotFoundException } from '@nestjs/common';
import { Meal } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateMealDto } from './dto/create-meal.dto';

@Injectable()
export class MealService {
  constructor(private readonly prismaService: PrismaService) {}

  async getMeals(userId: string): Promise<Meal[]> {
    return await this.prismaService.meal.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getMeal(id: string): Promise<Meal> {
    const meal = await this.prismaService.meal.findUnique({
      where: { id },
    });

    if (!meal) {
      throw new NotFoundException('Meal not found');
    }

    return meal;
  }

  async createMeal(dto: CreateMealDto, userId: string): Promise<Meal> {
    return await this.prismaService.meal.create({
      data: {
        ...dto,
        user: { connect: { id: userId } },
      },
    });
  }

  async updateMeal(id: string, dto: CreateMealDto): Promise<Meal> {
    return await this.prismaService.meal.update({
      where: { id },
      data: { ...dto },
    });
  }

  async deleteMeal(id: string): Promise<void> {
    await this.prismaService.meal.delete({ where: { id } });
  }
}
