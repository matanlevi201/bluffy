import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { customAlphabet } from 'nanoid';

@Injectable()
export class RoomsService {
  private readonly alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  private readonly nanoid = customAlphabet(this.alphabet, 6);

  constructor(private prisma: PrismaService) {}

  async generateUniqueRoomCode(): Promise<string> {
    let code: string;
    let exists = true;

    while (exists) {
      code = this.nanoid();
      const room = await this.prisma.room.findUnique({
        where: { roomCode: code },
      });
      exists = !!room;
    }

    return code;
  }

  async getActiveRoom(roomCode: string) {
    const room = await this.prisma.room.findUnique({
      where: { roomCode, status: 'waiting' },
    });
    if (!room) {
      throw new NotFoundException();
    }
    return room;
  }

  async createRoom(hostId: string) {
    const code = await this.generateUniqueRoomCode();
    return await this.prisma.$transaction(async (tx) => {
      await tx.room.deleteMany({
        where: { hostId, status: 'waiting' },
      });
      return await tx.room.create({
        data: { roomCode: code, hostId },
      });
    });
  }
}
