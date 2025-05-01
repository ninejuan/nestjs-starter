import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Injectable()
export class CookieService {
  constructor(private readonly configService: ConfigService) {}

  private getCookieOptions() {
    const isProduction =
      this.configService.get<string>('MODE') === 'production';
    return {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax' as const,
      domain: isProduction ? this.configService.get<string>('DOMAIN') : '',
    };
  }

  setTokens(res: Response, accessToken: string, refreshToken: string) {
    const cookieOptions = this.getCookieOptions();
    res.cookie('accessToken', accessToken, cookieOptions);
    res.cookie('refreshToken', refreshToken, cookieOptions);
  }

  clearTokens(res: Response) {
    const cookieOptions = this.getCookieOptions();
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
  }
}
