import { Controller, Get, Post, Body } from '@nestjs/common';

@Controller('services-simple')
export class ServicesSimpleController {
  @Get()
  findAll() {
    return { message: 'GET services-simple works' };
  }

  @Post()
  create(@Body() data: any) {
    return { message: 'POST services-simple works', data };
  }
}
