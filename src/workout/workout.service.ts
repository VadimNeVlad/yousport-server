import { Injectable, NotFoundException } from '@nestjs/common';
import { Workout } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Injectable()
export class WorkoutService {
  constructor(private readonly prismaService: PrismaService) {}

  async getWorkouts(userId: string): Promise<Workout[]> {
    return await this.prismaService.workout.findMany({
      where: { userId },
      include: {
        strength: true,
        endurance: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getWorkout(id: string): Promise<Workout> {
    const workout = await this.prismaService.workout.findUnique({
      where: { id },
      include: {
        strength: true,
        endurance: true,
      },
    });

    if (!workout) {
      throw new NotFoundException('Workout not found');
    }

    return workout;
  }

  async createWorkout(dto: CreateWorkoutDto, userId: string): Promise<Workout> {
    const { name, type, endurance, strength } = dto;
    return await this.prismaService.workout.create({
      data: {
        name,
        type,
        user: { connect: { id: userId } },
        ...(strength && { strength: { create: strength } }),
        ...(endurance && { endurance: { create: endurance } }),
      },
    });
  }

  async updateWorkout(dto: CreateWorkoutDto, id: string): Promise<Workout> {
    const { name, type, endurance, strength } = dto;

    return await this.prismaService.workout.update({
      where: { id },
      data: {
        name,
        type,
        ...(strength && { strength: { update: strength } }),
        ...(endurance && { endurance: { update: endurance } }),
      },
    });
  }

  async deleteWorkout(id: string): Promise<void> {
    await this.prismaService.strength.delete({
      where: { workoutId: id },
    });

    await this.prismaService.endurance.delete({
      where: { workoutId: id },
    });

    await this.prismaService.workout.delete({
      where: { id },
    });
  }
}
