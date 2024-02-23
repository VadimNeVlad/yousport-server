import { ConflictException, HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { AuthResponse } from './interfaces/auth';
import { User } from '@prisma/client';
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
}
