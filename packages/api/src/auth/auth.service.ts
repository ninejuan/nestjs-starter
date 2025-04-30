import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common'
import { UserService } from '@/user/user.service'
import { CreateUserDto } from './dto/create-user.dto'
import { UserDataDto } from './dto/user.dto'
import { JwtService } from '@nestjs/jwt'
import { JwtPayload } from './dto/JwtPayload.dto'
import { SignInDto } from './dto/sign-in.dto'
import * as bcrypt from 'bcryptjs'
import { Permission as PermissionEnum } from '@/common/enums/Permission.enum'
import * as crypto from 'crypto'
import { TokenRepository } from './repository/token.repo'
import { Request } from 'express'
import { GoogleUserDto } from './dto/google-user.dto'
import { map } from 'rxjs'
import { HttpService } from '@nestjs/axios'
import { GoogleProfile } from '@/common/interface/GoogleProfile.interface'

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
    )

    let payload: UserDataDto
    if (!existingUser) {
      const newMember = await new Promise((resolve, reject) => {
        this.httpService
          .get<GoogleProfile>('/userinfo/v2/me', {
            headers: { Authorization: `Bearer ${googleUser.accessToken}` },
          })
          .pipe(map(response => response.data))
          .subscribe({
            next: async (data) => {
              const member = await this.userService.createUser(
                data.email,
                data.name,
                PermissionEnum.USER,
              )

              resolve(member)
            },
            error: (_error) => {
              reject(new InternalServerErrorException(''))
            },
          })
      })
      payload = newMember as UserDataDto
    }
    else {
      payload = existingUser as UserDataDto
    }

    const validationKey = await this.generateValidationKey()

    const accessToken = await this.generateToken(
      'access',
      payload.email,
      validationKey,
    )
    const refreshToken = await this.generateToken(
      'refresh',
      payload.email,
      validationKey,
    )

    await this.tokenRepository.setRefreshToken(payload.email, refreshToken)
    await this.tokenRepository.setValidationKey(payload.email, validationKey)

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    }
  }

  async registerUser(createUserDto: CreateUserDto) {
    if (!createUserDto.password || !createUserDto.permission) {
      throw new BadRequestException('There is null data in createUserDto')
    }

    return await this.userService.createUser(
      createUserDto.email,
      createUserDto.name,
      PermissionEnum[createUserDto.permission],
      createUserDto.password,
    )
  }

  async handleSignIn(
    signInDto: SignInDto,
    req: Request & {
      user: UserDataDto
    },
  ) {
    if (!signInDto.email || !signInDto.password) {
      throw new BadRequestException('Email or Password is null.')
    }

    const user = await this.userService.findUserByEmail(signInDto.email)
    if (!user) throw new BadRequestException()
    req.user = user

    const match = await bcrypt.compare(signInDto.password, user.password)
    if (match) {
      const validationKey = await this.generateValidationKey()

      const accessToken = await this.generateToken(
        'access',
        user.email,
        validationKey,
      )
      const refreshToken = await this.generateToken(
        'refresh',
        user.email,
        validationKey,
      )

      await this.tokenRepository.setRefreshToken(user.email, refreshToken)
      await this.tokenRepository.setValidationKey(user.email, validationKey)

      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      }
    }
    throw new BadRequestException()
  }

  async signOut(email: string) {
    const user = await this.userService.findUserByEmail(email)
    if (!user) {
      throw new UnauthorizedException()
    }

    try {
      await this.tokenRepository.removeRefreshToken(user.email)
      await this.tokenRepository.removeValidationKey(user.email)
    }
    catch {
      throw new InternalServerErrorException()
    }

    return true
  }

  /* 여기서부터 토큰 관리 함수들입니다. */
  private async generateValidationKey(length: number = 32) {
    return crypto.randomBytes(length).toString('hex')
  }

  private async generateToken(
    tokenType: string = 'access',
    email: string,
    validationKey: string,
  ) {
    const user = await this.userService.findUserByEmail(email)

    const payload: JwtPayload = {
      id: user.id,
      email: user.email,
      permission: user.permission,
      validationKey: validationKey,
    }

    switch (tokenType) {
      case 'access':
        return this.jwtService.sign(payload)
      case 'refresh':
        return this.jwtService.sign(payload, { expiresIn: '7d' })
      default:
        throw new InternalServerErrorException(
          'Unable to generate user token: token type was not provided.',
        )
    }
  }

  async refreshAccessToken(refreshToken: string) {
    const decoded: JwtPayload = this.jwtService.verify(refreshToken)
    const user = await this.userService.findUserByEmail(decoded.email)

    if (!user || user.refreshToken !== refreshToken) {
      throw new UnauthorizedException()
    }

    const newAccessToken = await this.generateToken(
      'access',
      user.email,
      user.validationKey,
    )

    return {
      accessToken: newAccessToken,
      refreshToken: refreshToken,
    }
  }
  /* 여기까지 토큰 관리 함수들입니다. */
}
