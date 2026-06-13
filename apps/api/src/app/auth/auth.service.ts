import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';

const BCRYPT_COST = 12;

export interface AuthResult {
  token: string;
  user: {
    id: string;
    email: string;
    createdAt: Date;
  };
}

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
  ) {}

  async register(email: string, password: string): Promise<AuthResult> {
    const existing = await this.prisma.user.findUnique({ where: { email } });
    if (existing) {
      // Generic message — do not reveal that the email is taken
      throw new ConflictException('Registration failed');
    }

    const passwordHash = await bcrypt.hash(password, BCRYPT_COST);
    const user = await this.prisma.user.create({
      data: { email, passwordHash },
    });

    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, createdAt: user.createdAt } };
  }

  async login(email: string, password: string): Promise<AuthResult> {
    const user = await this.prisma.user.findUnique({ where: { email } });

    // Constant-time comparison even on miss — run bcrypt against a dummy hash
    const DUMMY_HASH = '$2b$12$invalid.hash.for.timing.safety.only.xxxx';
    const hashToCompare = user?.passwordHash ?? DUMMY_HASH;
    const valid = await bcrypt.compare(password, hashToCompare);

    if (!user || !valid) {
      // Generic message — do not distinguish unknown email from wrong password
      throw new UnauthorizedException('Invalid credentials');
    }

    const token = this.jwt.sign({ sub: user.id, email: user.email });
    return { token, user: { id: user.id, email: user.email, createdAt: user.createdAt } };
  }

  async validateUser(userId: string) {
    return this.prisma.user.findUnique({ where: { id: userId } });
  }
}
