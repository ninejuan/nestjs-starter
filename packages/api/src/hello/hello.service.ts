import { Injectable } from '@nestjs/common';
import { HelloRepository } from './repository/hello.repo';
import { CreateHelloDto } from './dto/create-hello.dto';

@Injectable()
export class HelloService {
  constructor(private readonly helloRepository: HelloRepository) {}
  async getFoo(foo: string) {
    return await this.helloRepository.getFoo(foo);
  }

  async create(createHelloDto: CreateHelloDto) {
    return await this.helloRepository.create(createHelloDto);
  }
}
