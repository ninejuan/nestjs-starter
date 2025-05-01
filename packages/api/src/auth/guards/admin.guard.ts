import {
  ExecutionContext,
  Injectable,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { Permission } from '../../common/enums/Permission.enum';

@Injectable()
export class AdminGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<
      keyof typeof Permission
    >('permission', [context.getHandler(), context.getClass()]);

    if (!requiredPermission || Permission[requiredPermission] < 0) {
      throw new InternalServerErrorException(
        'Please set Guard permission via setMetaData decorator.',
      );
    }

    const canActivate = await super.canActivate(context);
    if (!canActivate) {
      return false;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user?.permission) {
      throw new InternalServerErrorException('사용자 권한 정보가 없습니다.');
    }

    const userPermissionLevel = Object.keys(Permission).indexOf(
      user.permission,
    );
    const requiredPermissionLevel =
      Object.keys(Permission).indexOf(requiredPermission);

    if (userPermissionLevel > requiredPermissionLevel) {
      throw new ForbiddenException('해당 작업을 수행할 권한이 없습니다.');
    }

    return true;
  }
}
