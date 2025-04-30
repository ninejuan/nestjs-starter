import {
  ExecutionContext,
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from '../../common/enums/Permission.enum';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean | null> {
    const requiredPermission = this.reflector.getAllAndOverride<string>(
      'permission',
      [context.getHandler(), context.getClass()],
    );

    if (!requiredPermission || Permission[requiredPermission] < 0) {
      throw new InternalServerErrorException(
        'Please set Guard permission via setMetaData decorator.',
      );
    }

    const canActivate = (await super.canActivate(context)) as boolean;
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (
      !user?.permission ||
      !(Permission[user.permission] <= Permission[requiredPermission])
    ) {
      throw new ForbiddenException('해당 페이지에 접근할 권한이 없습니다.');
    }

    if (user.validationKey !== request.user.validationKey) {
      throw new UnauthorizedException(
        '다른 기기에서 로그인하여 로그아웃 되었습니다.',
      );
    }

    return true;
  }
}
