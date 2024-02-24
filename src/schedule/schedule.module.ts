import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Module({
  imports: [PrismaModule],
  controllers: [ScheduleController],
  providers: [ScheduleService, JwtGuard],
})
export class ScheduleModule {}
