import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('/me')
  getMyUser(@Req() req) {
    return this.usersService.getMyUser(req.user.id);
  }

  @Get()
  getUsers() {
    return this.usersService.getUsers();
  }
}
