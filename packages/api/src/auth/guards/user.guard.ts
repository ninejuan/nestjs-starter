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

  private validateEmailDomain(email: string): boolean {
    const allowedDomains = this.configService.get<string>(
      'ALLOWED_EMAIL_DOMAINS',
    );
    const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@(${allowedDomains})$`);
    return emailRegex.test(email);
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.email) {
      throw new InternalServerErrorException('인증 정보가 올바르지 않습니다.');
    }

    const isEmailAllowed = this.validateEmailDomain(user.email);
    const useEmailRestriction = this.configService.get<boolean>(
      'USE_EMAIL_RESTRICTION',
    );

    if (!isEmailAllowed && useEmailRestriction) {
      throw new ForbiddenException(
        '조직의 Google Workspace 계정을 이용하지 않는 사용자는 접근할 수 없습니다.',
      );
    }

    return true;
  }
}
