import { BadRequestException, Injectable } from '@nestjs/common'
import * as Minio from 'minio'
import { FileType } from '@/common/enums/FileType.enum'
import { v4 as uuidv4 } from 'uuid'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class MinioService {
  constructor(private readonly configService: ConfigService) {}
  async uploadFiles(files: Array<Express.Multer.File>, type: FileType) {
    if (!files || !(type in FileType)) {
      throw new BadRequestException()
    }

    const filesUrlList: string[] = []
    for (const file of files) {
      const fileUrl = await this.uploadFile(
        new File([file.buffer], file.originalname),
        this.generateFilename(file.originalname),
        type,
      )
      filesUrlList.push(fileUrl)
    }
    return filesUrlList
  }

  async uploadFile(file: File, fileName: string, type: FileType) {
    const minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_URL'),
      port: this.configService.get<string>('MODE') == 'production' ? 443 : 9000,
      useSSL: this.configService.get<string>('MODE') == 'production',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    })

    const buffer = Buffer.from(await file.arrayBuffer())
    const path = type ? `${type}/${fileName}` : fileName
    await minioClient.putObject(
      this.configService.get<string>('BUCKET_NAME'),
      path,
      buffer,
      file.size,
    )
    return `https://${this.configService.get<string>(
      'MINIO_URL',
    )}/${this.configService.get<string>('BUCKET_NAME')}/${path}`
  }

  async getFile(type: FileType, filename: string) {
    const minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_URL'),
      port: this.configService.get<string>('MODE') == 'production' ? 443 : 9000,
      useSSL: this.configService.get<string>('MODE') == 'production',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    })

    const path = type ? `${type}/${filename}` : filename
    return await minioClient.presignedGetObject(
      this.configService.get<string>('BUCKET_NAME'),
      path,
    )
  }

  async deleteFile(type: FileType, filename: string) {
    const minioClient = new Minio.Client({
      endPoint: this.configService.get<string>('MINIO_URL'),
      port: this.configService.get<string>('MODE') == 'production' ? 443 : 9000,
      useSSL: this.configService.get<string>('MODE') == 'production',
      accessKey: this.configService.get<string>('MINIO_ACCESS_KEY'),
      secretKey: this.configService.get<string>('MINIO_SECRET_KEY'),
    })

    const path = type ? `${type}/${filename}` : filename
    await minioClient.removeObject(
      this.configService.get<string>('BUCKET_NAME'),
      path,
    )
  }

  generateFilename(originalname): string {
    const extension = originalname.split('.').pop()
    return `${uuidv4()}.${extension}`
  }
}
