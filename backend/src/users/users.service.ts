import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getMyUser(id: string) {
    const user = await this.prisma.user.findUnique({
      select: { id: true, name: true },
      where: { id },
    });

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  async getUsers() {
    return await this.prisma.user.findMany({
      select: { id: true, name: true },
    });
  }
}
