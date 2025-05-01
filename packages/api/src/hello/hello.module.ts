import { Module } from '@nestjs/common';
import { HelloService } from './hello.service';
import { HelloController } from './hello.controller';
import { HelloRepository } from './repository/hello.repo';

@Module({
  controllers: [HelloController],
  providers: [HelloService, HelloRepository],
})
export class HelloModule {}
