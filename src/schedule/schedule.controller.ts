import { Controller, Get, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { Schedule } from '@prisma/client';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getSchedule(@CurrentUser('id') uid: string): Promise<Schedule> {
    return this.scheduleService.getSchedule(uid);
  }
}
