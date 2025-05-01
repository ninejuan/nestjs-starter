import { UserService } from '@/user/user.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UserDataDto } from '../dto/user.dto';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.accessToken;
        },
      ]),
      ignoreExpiration:
        configService.get('MODE') == 'production' ? false : true,
      // secretOrKey: configService.get<string>('JWT_SECRET'),
      secretOrKey: '293hefkjxdr@',
    });
  }

  async validate(payload: Partial<UserDataDto>) {
    if (!payload?.email) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    const user = await this.userService.findUserByEmail(payload.email);
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 사용자입니다.');
    }

    return {
      id: user.uuid,
      email: user.email,
      permission: user.permission,
    };
  }
}
