import {
  type CallHandler,
  type ExecutionContext,
  HttpStatus,
  Injectable,
  type NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiResponseDto } from '@/common/dto/api-response.dto';

@Injectable()
export class TransformInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const response = context.switchToHttp().getResponse<Response>();
    return next.handle().pipe(
      map((data) => {
        const apiResponse = new ApiResponseDto();
        apiResponse.status = response.statusCode || HttpStatus.OK;
        apiResponse.data = data;
        response.status(HttpStatus.OK).send(apiResponse);
      }),
    );
  }
}
