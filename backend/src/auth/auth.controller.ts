import { Body, Controller, Delete, Post } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { LoginDto } from './dto/login.dto';
import { LoginRes } from './response/token.res';
import { SessionService } from './services/session.service';
import { RefreshTokenDto } from './dto/rf-token.dto';
import { LogoutDto } from './dto/logout.dto';
import { SuccessResponse } from 'src/common/response/success.res';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private sessionService: SessionService,
  ) {}

  @Post('login')
  async login(@Body() payload: LoginDto): Promise<LoginRes> {
    return await this.authService.login(payload);
  }

  @Post('refresh')
  async refreshToken(@Body() payload: RefreshTokenDto) {
    return await this.sessionService.refreshToken(payload);
  }

  @Delete('logout')
  async logout(@Body() payload: LogoutDto): Promise<SuccessResponse> {
    await this.sessionService.deleteToken(payload);
    return { success: true };
  }
}
