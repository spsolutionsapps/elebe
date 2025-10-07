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

  @Post('dev-login')
  devLogin() {
    // Solo para desarrollo - crear token simple
    const devUser = {
      id: 'dev-user-id',
      email: 'admin@fashionstyle.com',
      name: 'Admin Dev',
      role: 'admin'
    };

    // Crear un token simple para desarrollo
    const simpleToken = 'dev-token-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    
    return {
      access_token: simpleToken,
      user: devUser,
    };
  }
}
