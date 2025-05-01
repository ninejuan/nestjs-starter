import { Injectable } from '@nestjs/common';
import { HelloRepository } from './repository/hello.repo';

@Injectable()
export class HelloService {
  constructor(private readonly helloRepository: HelloRepository) {}
  async getFoo(foo: string) {
    return await this.helloRepository.getFoo(foo);
  }
}
