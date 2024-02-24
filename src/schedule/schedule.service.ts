import { Injectable } from '@nestjs/common';
import { Schedule } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private readonly prismaService: PrismaService) {}

  async getSchedule(userId: string): Promise<Schedule> {
    return this.prismaService.schedule.findUnique({
      where: {
        userId,
      },
      include: {
        assignments: {
          include: {
            meals: true,
            workouts: true,
          },
        },
      },
    });
  }
}
