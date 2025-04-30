import {
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@/user/user.service';
import { UserDataDto } from './dto/user.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './dto/JwtPayload.dto';
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum';
import { TokenRepository } from './repository/token.repo';
import { GoogleUserDto } from './dto/google-user.dto';
import { map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { GoogleProfile } from '@/common/interface/GoogleProfile.interface';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UserService))
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
    private readonly httpService: HttpService,
  ) {}

  async handleGoogleSignIn(googleUser: GoogleUserDto) {
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
            error: (_error) => {
              reject(new InternalServerErrorException(''));
            },
          });
      });
      payload = newMember as UserDataDto;
    } else {
      payload = existingUser as UserDataDto;
    }

    const accessToken = await this.generateToken('access', payload.email);
    const refreshToken = await this.generateToken('refresh', payload.email);

    await this.tokenRepository.setRefreshToken(payload.email, refreshToken);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async signOut(email: string) {
    const user = await this.userService.findUserByEmail(email);
    if (!user) {
      throw new UnauthorizedException();
    }

    try {
      await this.tokenRepository.removeRefreshToken(user.email);
    } catch {
      throw new InternalServerErrorException();
    }

    return true;
  }

  private async generateToken(tokenType: string = 'access', email: string) {
    const user = await this.userService.findUserByEmail(email);

    const payload: JwtPayload = {
      id: user.uuid,
      email: user.email,
      permission: user.permission,
    };

    switch (tokenType) {
      case 'access':
        return this.jwtService.sign(payload);
      case 'refresh':
        return this.jwtService.sign(payload, { expiresIn: '7d' });
      default:
        throw new InternalServerErrorException(
          'Unable to generate user token: token type was not provided.',
        );
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded: JwtPayload = this.jwtService.verify(refreshToken);
    const user = await this.userService.findUserByEmail(decoded.email);

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException();
    }

    const newAccessToken = await this.generateToken('access', user.email);

    return {
      accessToken: newAccessToken,
      refreshToken: refreshToken,
    };
  }
}
