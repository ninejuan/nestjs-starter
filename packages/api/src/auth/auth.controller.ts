import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserGuard } from '@/auth/guards/user.guard';
import { UserDataDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleUserDto } from './dto/google-user.dto';
import { TokenResponseDto } from './dto/token-response.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '구글 로그인' })
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleSignIn() {}

  @ApiOperation({ summary: '구글 로그인 리다이렉트' })
  @ApiResponse({ type: TokenResponseDto })
  @Get('/google/redirect')
  @UseGuards(AuthGuard('google'))
  async googleRedirection(
    @Req()
    req: Request & {
      user: GoogleUserDto;
    },
  ) {
    return await this.authService.handleGoogleSignIn(req.user);
  }

  @ApiOperation({ summary: '액세스 토큰 갱신' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: { refreshToken: { type: 'string' } },
    },
  })
  @ApiResponse({ type: TokenResponseDto })
  @Post('/refresh')
  @UseGuards(UserGuard)
  async refreshAccessToken(@Body('refreshToken') refreshToken: string) {
    return await this.authService.refreshAccessToken(refreshToken);
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ type: Boolean })
  @ApiBearerAuth()
  @Get('/logout')
  @UseGuards(UserGuard)
  async logout(
    @Req()
    req: Request & {
      user: UserDataDto;
    },
  ) {
    return await this.authService.signOut(req.user?.email);
  }
}
