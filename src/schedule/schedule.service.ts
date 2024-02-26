import { Injectable } from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Injectable()
export class ScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSchedule(userId: string): Promise<Schedule> {
    return await this.prismaService.schedule.findUnique({
      where: { userId },
      include: {
        assignments: {
          include: {
            meals: true,
            workouts: {
              include: {
                strength: true,
                endurance: true,
              },
            },
          },
        },
      },
    });
  }

  async updateSchedule(dto: UpdateScheduleDto) {
    const { id, meals, workouts } = dto;

    return this.prismaService.assignment.update({
      where: { id },
      data: {
        ...(meals && {
          meals: {
            set: [],
            connect: meals.map((meal) => ({ id: meal.id })),
          },
        }),
        ...(workouts && {
          workouts: {
            set: [],
            connect: workouts.map((workout) => ({
              id: workout.id,
            })),
          },
        }),
      },
    });
  }
}
