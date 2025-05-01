import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Res,
  BadRequestException,
} from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { Request, Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserGuard } from '@/auth/guards/user.guard';
import { UserDataDto } from './dto/user.dto';
import { AuthGuard } from '@nestjs/passport';
import { GoogleUserDto } from './dto/google-user.dto';
import { TokenResponseDto } from './dto/token-response.dto';
import { CookieService } from './services/cookie.service';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly cookieService: CookieService,
  ) {}

  @ApiOperation({ summary: '구글 로그인 리다이렉트' })
  @ApiResponse({ type: TokenResponseDto })
  @Get('/google')
  @UseGuards(AuthGuard('google'))
  async googleRedirection(
    @Req()
    req: Request & {
      user: GoogleUserDto;
    },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token: TokenResponseDto = await this.authService.handleGoogleSignIn(
      req.user,
    );

    this.cookieService.setTokens(res, token.accessToken, token.refreshToken);

    return {
      email: req.user.email,
      ...token,
    };
  }

  @ApiOperation({ summary: '액세스 토큰 갱신' })
  @ApiResponse({ type: TokenResponseDto })
  @Post('/refresh')
  @ApiBearerAuth('refreshToken')
  @UseGuards(UserGuard)
  async refreshAccessToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    if (!req.cookies?.refreshToken) {
      throw new BadRequestException('Refresh Token이 없습니다.');
    }
    const token = await this.authService.refreshAccessToken(
      req.cookies?.refreshToken,
    );

    this.cookieService.setTokens(res, token.accessToken, token.refreshToken);

    return 'success';
  }

  @Get('/me')
  @ApiOperation({ summary: '내 정보 조회' })
  @ApiResponse({ type: UserDataDto })
  @ApiBearerAuth('accessToken')
  @UseGuards(UserGuard)
  async getMe(
    @Req()
    req: Request & {
      user: UserDataDto;
    },
  ) {
    return req.user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @ApiResponse({ type: Boolean })
  @ApiBearerAuth('accessToken')
  @Get('/logout')
  @UseGuards(UserGuard)
  async logout(@Res({ passthrough: true }) res: Response) {
    this.cookieService.clearTokens(res);
    return 'success';
  }
}
