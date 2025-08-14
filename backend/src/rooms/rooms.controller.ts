import { Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Get(':roomCode')
  getActiveRoom(@Param('roomCode') roomCode: string) {
    return this.roomsService.getActiveRoom(roomCode);
  }

  @Post('')
  createRoom(@Req() req) {
    const hostId = req.user.id;
    return this.roomsService.createRoom(hostId);
  }
}
