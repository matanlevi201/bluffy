import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @Post('signin')
  signin(@Body() signinDto: SigninDto, @Res() res) {
    return this.authService.signin(signinDto, res);
  }

  @Get('refresh')
  refresh(@Req() req, @Res() res) {
    return this.authService.refresh(req, res);
  }

  @Get('signout')
  signout(@Res() res) {
    return this.authService.signout(res);
  }
}
