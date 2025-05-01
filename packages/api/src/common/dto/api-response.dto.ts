import { HttpStatus } from '@nestjs/common';
import { KSTDate } from '@/common/utils/kstdate';

export class ApiResponseDto {
  public status: HttpStatus = HttpStatus.OK;
  public message: string = 'OK';
  public data: unknown = null;
  public responseAt: Date = new KSTDate();
}
