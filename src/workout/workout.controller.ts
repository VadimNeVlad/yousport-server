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
import { WorkoutService } from './workout.service';
import { JwtGuard } from 'src/auth/guards/jwt.guard';
import { CurrentUser } from 'src/user/decorators/current-user.decorator';
import { Workout } from '@prisma/client';
import { CreateWorkoutDto } from './dto/create-workout.dto';

@Controller('workouts')
export class WorkoutController {
  constructor(private readonly workoutService: WorkoutService) {}

  @Get()
  @UseGuards(JwtGuard)
  async getWorkouts(@CurrentUser('id') userId: string): Promise<Workout[]> {
    return this.workoutService.getWorkouts(userId);
  }

  @Get(':id')
  @UseGuards(JwtGuard)
  async getWorkout(@Param('id') id: string): Promise<Workout> {
    return this.workoutService.getWorkout(id);
  }

  @Post()
  @UseGuards(JwtGuard)
  async createWorkout(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateWorkoutDto,
  ): Promise<Workout> {
    return this.workoutService.createWorkout(dto, userId);
  }

  @Put(':id')
  @UseGuards(JwtGuard)
  async updateWorkout(
    @Param('id') id: string,
    @Body() dto: CreateWorkoutDto,
  ): Promise<Workout> {
    return this.workoutService.updateWorkout(dto, id);
  }

  @Delete(':id')
  @UseGuards(JwtGuard)
  async deleteWorkout(@Param('id') id: string): Promise<void> {
    return this.workoutService.deleteWorkout(id);
  }
}
