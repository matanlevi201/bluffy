import { Controller, Post, Req, UseGuards } from '@nestjs/common';
import { RoomsService } from './rooms.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('rooms')
@UseGuards(JwtAuthGuard)
export class RoomsController {
  constructor(private readonly roomsService: RoomsService) {}

  @Post('')
  createRoom(@Req() req) {
    const hostId = req.user.id;
    return this.roomsService.createRoom(hostId);
  }
}
