import { Injectable, PipeTransform } from '@nestjs/common'

@Injectable()
export class NegativeNumberPipe implements PipeTransform {
  transform(value: number) {
    return value < 0 ? value * -1 : value
  }
}
