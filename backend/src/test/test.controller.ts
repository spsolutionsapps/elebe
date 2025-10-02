import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('test')
export class TestController {
  @Get()
  getTest() {
    return { message: 'Test GET endpoint works' };
  }

  @Post()
  createTest(@Body() data: any) {
    return { message: 'Test POST endpoint works', data };
  }
}
