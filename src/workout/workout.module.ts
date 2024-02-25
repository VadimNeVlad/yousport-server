import { Module } from '@nestjs/common';
import { WorkoutService } from './workout.service';
import { WorkoutController } from './workout.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Module({
  imports: [PrismaModule],
  controllers: [WorkoutController],
  providers: [WorkoutService, JwtGuard],
})
export class WorkoutModule {}
