import { Module } from '@nestjs/common';
import { MealService } from './meal.service';
import { MealController } from './meal.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtGuard } from 'src/auth/guards/jwt.guard';

@Module({
  imports: [PrismaModule],
  controllers: [MealController],
  providers: [MealService, JwtGuard],
})
export class MealModule {}
