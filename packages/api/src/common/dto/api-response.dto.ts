import { HttpStatus } from '@nestjs/common';
import { KSTDate } from '../utils/kstdate';

export class ApiResponseDto {
  public status: HttpStatus = HttpStatus.OK;
  public msg: string = 'OK';
  public data: unknown = null;
  public responseAt: Date = new KSTDate();
}
