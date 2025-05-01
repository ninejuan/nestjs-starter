import { Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class FooBarPipe implements PipeTransform {
  transform(value: string) {
    if (value == 'foo') {
      return 'bar';
    } else return value;
  }
}
