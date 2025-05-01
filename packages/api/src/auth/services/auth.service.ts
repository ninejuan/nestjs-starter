import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserDataDto } from '../dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../dto/jwt-payload';
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';
import { GoogleUserDto } from '../dto/google-user.dto';
import { map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { GoogleProfile } from '@/common/interface/GoogleProfile.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
  ) {}

  async handleGoogleSignIn(googleUser: GoogleUserDto) {
    try {
      const existingUser = await this.userService.findUserByEmail(
        googleUser.email,
      );
      let payload: UserDataDto;

      if (!existingUser) {
        const newMember = await new Promise((resolve, reject) => {
          this.httpService
            .get<GoogleProfile>('/userinfo/v2/me', {
              headers: { Authorization: `Bearer ${googleUser.accessToken}` },
            })
            .pipe(map((response) => response.data))
            .subscribe({
              next: async (data) => {
                const member = await this.userService.createUser(
                  data.email,
                  data.name,
                  PermissionEnum.USER,
                );
                resolve(member);
              },
              error: (error) => {
                reject(
                  new InternalServerErrorException(
                    'Google 프로필 정보를 가져오는데 실패했습니다.',
                  ),
                );
              },
            });
        });
        payload = newMember as UserDataDto;
      } else {
        payload = {
          ...existingUser,
          permission: existingUser.permission as unknown as PermissionEnum,
        } as UserDataDto;
      }

      return this.generateTokens(payload.email);
    } catch (error) {
      if (error instanceof InternalServerErrorException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '로그인 처리 중 오류가 발생했습니다.',
      );
    }
  }

  private async generateTokens(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    const payload: JwtPayload = {
      id: user.uuid,
      email: user.email,
      permission: user.permission,
    };

    const accessToken = this.jwtService.sign(payload, { expiresIn: '6h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });

    return {
      accessToken,
      refreshToken,
    };
  }

  async refreshAccessToken(refreshToken: string) {
    try {
      const decoded: JwtPayload = this.jwtService.verify(refreshToken);
      const user = await this.userService.findUserByEmail(decoded.email);

      if (!user) {
        throw new UnauthorizedException('유효하지 않은 리프레시 토큰입니다.');
      }

      return this.generateTokens(user.email);
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '토큰 갱신 중 오류가 발생했습니다.',
      );
    }
  }
}
