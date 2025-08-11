import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import {
  accessExp,
  accessJwtSecret,
  refreshExp,
  refreshJwtSecret,
} from 'src/utils/constants';
import { Request, Response } from 'express';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwtService: JwtService) {}

  async hashPassword(password: string) {
    const saltOrRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltOrRounds);
    return hashedPassword;
  }

  async comparePassword(providedPassword: string, password: string) {
    return await bcrypt.compare(providedPassword, password);
  }

  async generateRefershToken(payload: {
    id: string;
    name: string;
    email: string;
  }) {
    return await this.jwtService.signAsync(payload, {
      secret: refreshJwtSecret,
      expiresIn: '7d',
    });
  }

  async generateAccessToken(payload: {
    id: string;
    name: string;
    email: string;
  }) {
    return await this.jwtService.signAsync(payload, {
      secret: accessJwtSecret,
      expiresIn: '15m',
    });
  }

  async signup(signupDto: SignupDto) {
    const { name, email, password } = signupDto;

    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }

    const hashedPassword = await this.hashPassword(password);
    const user = await this.prisma.user.create({
      data: { name, email, password: hashedPassword },
    });
    return { id: user.id, name: user.name };
  }

  async signin(signinDto: SigninDto, res: Response) {
    const { email, password } = signinDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('Wrong credentials');
    }

    const isMatch = await this.comparePassword(password, user.password);

    if (!isMatch) {
      throw new BadRequestException('Wrong credentials');
    }
    const accessToken = await this.generateAccessToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    const refreshToken = await this.generateRefershToken({
      id: user.id,
      name: user.name,
      email: user.email,
    });
    if (!accessToken || !refreshToken) {
      throw new ForbiddenException();
    }

    res.cookie('accessToken', accessToken, {
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: accessExp,
    });

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: refreshExp,
    });

    return res.send({ message: 'Signed in' });
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) throw new UnauthorizedException();

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: refreshJwtSecret,
      });

      const accessToken = await this.generateAccessToken({
        id: payload.id,
        name: payload.name,
        email: payload.email,
      });
      if (!accessToken) {
        throw new ForbiddenException();
      }

      res.cookie('accessToken', accessToken, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: accessExp,
      });
      res.send();
    } catch {
      throw new UnauthorizedException();
    }
  }

  signout(res: Response) {
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    return res.send();
  }
}
