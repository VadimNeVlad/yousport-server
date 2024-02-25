import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './auth/auth.module';
import { ScheduleModule } from './schedule/schedule.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { WorkoutModule } from './workout/workout.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    ScheduleModule,
    UserModule,
    ConfigModule.forRoot(),
    WorkoutModule,
  ],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
