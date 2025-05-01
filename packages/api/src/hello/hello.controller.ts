import { Controller, Get, Post, Body, Param, UseFilters } from '@nestjs/common';
import { HelloService } from './hello.service';
import { CreateHelloDto } from './dto/create-hello.dto';
import { SentryFilter } from '@/common/filters/global.filter';

@UseFilters(SentryFilter)
@Controller('hello')
export class HelloController {
  constructor(private readonly helloService: HelloService) {}

  @Get(':foo')
  findOne(@Param('foo') foo: string) {
    return this.helloService.getFoo(foo);
  }

  @Post()
  create(@Body() createHelloDto: CreateHelloDto) {
    console.log(createHelloDto);
    return this.helloService.create(createHelloDto);
  }
}
