import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { GoogleUserDto } from '../dto/google-user.dto';
import { GoogleProfile } from '@/common/interface/GoogleProfile.interface';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private readonly configService: ConfigService) {
    super({
      clientID: configService.get<string>('GOOGLE_CLIENT_ID'),
      clientSecret: configService.get<string>('GOOGLE_CLIENT_SECRET'),
      callbackURL: `${configService.get<string>('DOMAIN')}${configService.get<string>('GOOGLE_REDIRECT_PARAM')}`,
      scope: ['profile', 'email'],
      passReqToCallback: true,
    });
  }

  private validateEmailDomain(email: string): boolean {
    const allowedDomains = this.configService.get<string>(
      'ALLOWED_EMAIL_DOMAINS',
    );
    const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@(${allowedDomains})$`);
    return emailRegex.test(email);
  }

  async validate(
    _req: Request,
    accessToken: string,
    _refreshToken: string,
    profile: GoogleProfile,
    done: VerifyCallback,
  ): Promise<void> {
    const { email } = profile._json;

    if (!email) {
      return done(
        new ForbiddenException('이메일 정보를 가져올 수 없습니다.'),
        null,
      );
    }

    const isEmailAllowed = this.validateEmailDomain(email);
    const useEmailRestriction = this.configService.get<boolean>(
      'USE_EMAIL_RESTRICTION',
    );

    if (!isEmailAllowed && useEmailRestriction) {
      return done(
        new ForbiddenException(
          '조직의 Google Workspace 계정을 이용하지 않는 사용자는 접근할 수 없습니다.',
        ),
        null,
      );
    }

    const user: GoogleUserDto = {
      email,
      accessToken,
    };

    return done(null, user);
  }
}
