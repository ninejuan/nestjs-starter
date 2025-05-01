import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class NegativeNumberPipe implements PipeTransform {
  transform(value: string) {
    if (value == 'foo') {
      return 'bar';
    }
  }
}
