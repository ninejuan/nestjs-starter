import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpStatus,
} from '@nestjs/common'
import { PrismaClientKnownRequestError } from '@your-organization/database/runtime/library'
import { Response } from 'express'
import {
  PrismaForeignKeyConstraintError,
  PrismaRecordDoesNotExistError,
  PrismaUniqueConstraintError,
  toTypedPrismaError,
} from '@/common/prisma/prisma.exception'

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  catch(error: PrismaClientKnownRequestError, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const prismaError = toTypedPrismaError(error)

    if (!prismaError) {
      throw error
    }

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = '서버 에러가 발생했습니다.'

    if (prismaError instanceof PrismaUniqueConstraintError) {
      status = HttpStatus.CONFLICT

      message = '중복된 데이터가 존재합니다.'
    }
    else if (prismaError instanceof PrismaRecordDoesNotExistError) {
      status = HttpStatus.NOT_FOUND

      message = '데이터를 찾을 수 없습니다.'
    }
    else if (prismaError instanceof PrismaForeignKeyConstraintError) {
      status = HttpStatus.BAD_REQUEST

      message = '입력한 데이터가 올바르지 않습니다.'
    }

    response.status(status).json({
      statusCode: status,
      message,
      error: prismaError.code,
    })
  }
}
