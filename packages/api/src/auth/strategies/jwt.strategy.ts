import { UserService } from '@/user/user.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { ConfigService } from '@nestjs/config'
import { UserDataDto } from '../dto/user.dto'

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration:
        configService.get('MODE') == 'production' ? false : true,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    })
  }

  async validate(payload: Partial<UserDataDto>) {
    if (!payload) {
      throw new UnauthorizedException('JWT Payload가 없습니다.')
    }
    const user = await this.userService.findUserByEmail(payload.email)
    if (!user) {
      throw new UnauthorizedException('유저를 찾을 수 없습니다.')
    }

    return {
      id: payload.id,
      email: payload.email,
      permission: payload.permission,
      validationKey: payload.validationKey,
    }
  }
}
