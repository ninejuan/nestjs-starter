import {
  BadRequestException,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  SetMetadata,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { MinioService } from './minio.service'
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { FilesInterceptor } from '@nestjs/platform-express'
import { AdminGuard } from '@/auth/guards/admin.guard'
import { FileType } from '@/common/enums/FileType.enum'

@ApiBearerAuth()
@ApiTags('Minio')
@Controller('minio')
export class MinioController {
  constructor(private readonly minioService: MinioService) {}

  @ApiOperation({ summary: '파일 복수 업로드' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'array',
          items: {
            type: 'string',
            format: 'binary',
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 200,
    description: '파일 업로드 성공',
    schema: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
  })
  @Post('/:type')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'ADMIN')
  @UseInterceptors(FilesInterceptor('files'))
  async uploadFile(
    @Param('type') type: FileType,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    if (!files || !(type in FileType)) {
      throw new BadRequestException('유효하지 않은 파일 또는 타입입니다.')
    }

    return await Promise.all(
      files.map(async (file) => {
        const fileName = this.minioService.generateFilename(file.originalname)
        return await this.minioService.uploadFile(
          new File([file.buffer], file.originalname),
          fileName,
          type,
        )
      }),
    )
  }

  @Get('/:type/:filename')
  async getFile(
    @Param('type') type: string,
    @Param('filename') filename: string,
  ) {
    const fileType = FileType[type.toUpperCase()]
    if (!fileType) {
      throw new BadRequestException('유효하지 않은 파일 타입입니다.')
    }
    return await this.minioService.getFile(fileType, filename)
  }

  @Delete('/:type/:filename')
  @UseGuards(AdminGuard)
  @SetMetadata('permission', 'MANAGER')
  async deleteFile(
    @Param('type') type: string,
    @Param('filename') filename: string,
  ) {
    const fileType = FileType[type.toUpperCase()]
    if (!fileType) {
      throw new BadRequestException('유효하지 않은 파일 타입입니다.')
    }
    return await this.minioService.deleteFile(fileType, filename)
  }
}
