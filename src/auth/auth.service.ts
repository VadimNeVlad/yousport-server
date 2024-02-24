import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './interfaces/auth';
import { Prisma, User } from '@prisma/client';
import { Tokens } from './interfaces/token';
import { compare, hashSync } from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponse> {
    const { email, password } = dto;
    const existingUser = await this.findUserByEmail(email);

    if (existingUser) {
      throw new ConflictException(
        'User with this email address already exists',
      );
    }

    const user = await this.prismaService.user.create({
      data: {
        email,
        password: this.hashPassword(password),
      },
    });

    await this.createSchedule(user.id);

    const tokens = await this.generateTokens(user);

    return { user, ...tokens };
  }

  async login(dto: RegisterDto): Promise<AuthResponse> {
    const { email, password } = dto;
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new HttpException('Invalid email or password', 400);
    }

    const isPasswordCorrect = await compare(password, user.password);

    if (!isPasswordCorrect) {
      throw new HttpException('Invalid email or password', 400);
    }

    const tokens = await this.generateTokens(user);

    return {
      user,
      ...tokens,
    };
  }

  private async findUserByEmail(email: string): Promise<User> {
    return this.prismaService.user.findUnique({ where: { email } });
  }

  private async generateTokens(user: User): Promise<Tokens> {
    const data = { id: user.id, email: user.email };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '7d',
    });

    return { accessToken };
  }

  private hashPassword(str: string): string {
    return hashSync(str, 10);
  }

  private async createSchedule(userId: string): Promise<void> {
    const schedule = await this.prismaService.schedule.create({
      data: {
        user: { connect: { id: userId } },
      },
    });

    await this.createAssignments(schedule.id);
  }

  private async createAssignments(scheduleId: string): Promise<void> {
    const assignments: Prisma.AssignmentCreateManyInput[] = [
      { day: 'Monday', key: 0, scheduleId },
      { day: 'Tuesday', key: 1, scheduleId },
      { day: 'Wednesday', key: 2, scheduleId },
      { day: 'Thursday', key: 3, scheduleId },
      { day: 'Friday', key: 4, scheduleId },
      { day: 'Saturday', key: 5, scheduleId },
      { day: 'Sunday', key: 6, scheduleId },
    ];

    await this.prismaService.assignment.createMany({
      data: assignments,
    });
  }
}
