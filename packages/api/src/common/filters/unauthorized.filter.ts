import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  UnauthorizedException,
} from '@nestjs/common'
import { Response } from 'express'

@Catch(UnauthorizedException)
export class UnauthorizedExceptionFilter implements ExceptionFilter {
  catch(exception: UnauthorizedException, host: ArgumentsHost) {
    console.log('401 exception catched 0')
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()

    response.status(401).json({
      statusCode: 401,
      message: '인증 실패: 유효하지 않은 토큰이거나 권한이 없습니다.',
      error: 'Unauthorized',
    })
  }
}
