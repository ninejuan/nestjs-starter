import {
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class UserGuard extends AuthGuard('jwt') {
  constructor(private readonly configService: ConfigService) {
    super();
  }

  private async validateEmailAddr(email: string) {
    return new RegExp(
      `^[a-zA-Z0-9._%+-]+@(${this.configService.get<string>('ALLOWED_EMAIL_DOMAINS')})$`,
    ).test(email);
  }

  async canActivate(context: ExecutionContext): Promise<boolean | null> {
    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;
    if (!user) {
      throw new InternalServerErrorException('로그인이 필요합니다.');
    }

    if (
      !this.validateEmailAddr(user.email) ||
      this.configService.get<boolean>('USE_EMAIL_RESTRICTION') == true
    ) {
      throw new ForbiddenException(
        '조직의 Google Workspace 계정을 이용하지 않는 사용자는 접근할 수 없습니다.',
      );
    }
    return true;
  }
}
