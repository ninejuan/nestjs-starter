import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponseDto } from '../dto/api-response.dto';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();

    const errorResponse = new ApiResponseDto();
    errorResponse.status = status;
    errorResponse.message = typeof exceptionResponse === 'string'
      ? exceptionResponse
      : (exceptionResponse as any).message || '서버 에러가 발생했습니다.';

    response.status(status).json(errorResponse);
  }
}
