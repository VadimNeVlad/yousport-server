import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { Schedule } from '@prisma/client';
import { UpdateScheduleDto } from './dto/update-schedule.dto';

@Controller('schedule')
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getSchedule(@CurrentUser('id') uid: string): Promise<Schedule> {
    return this.scheduleService.getSchedule(uid);
  }

  @Put()
  @UseGuards(JwtGuard)
  async updateSchedule(@Body() dto: UpdateScheduleDto) {
    return this.scheduleService.updateSchedule(dto);
  }
}
