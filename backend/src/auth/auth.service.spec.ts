import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn().mockReturnValue('mock-jwt-token'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user data for valid credentials', async () => {
      const result = await service.validateUser('admin@fashionstyle.com', 'admin123');
      
      expect(result).toEqual({
        id: 'temp-user-id',
        email: 'admin@fashionstyle.com',
        name: 'Administrador',
        role: 'admin'
      });
    });

    it('should return null for invalid credentials', async () => {
      const result = await service.validateUser('invalid@email.com', 'wrongpassword');
      
      expect(result).toBeNull();
    });

    it('should return null for valid email but wrong password', async () => {
      const result = await service.validateUser('admin@fashionstyle.com', 'wrongpassword');
      
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data for valid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'admin@fashionstyle.com',
        password: 'admin123'
      };

      const result = await service.login(loginDto);

      expect(jwtService.sign).toHaveBeenCalledWith({
        email: 'admin@fashionstyle.com',
        sub: 'temp-user-id',
        role: 'admin'
      });

      expect(result).toEqual({
        access_token: 'mock-jwt-token',
        user: {
          id: 'temp-user-id',
          email: 'admin@fashionstyle.com',
          name: 'Administrador',
          role: 'admin',
        },
      });
    });

    it('should throw UnauthorizedException for invalid credentials', async () => {
      const loginDto: LoginDto = {
        email: 'invalid@email.com',
        password: 'wrongpassword'
      };

      await expect(service.login(loginDto)).rejects.toThrow(UnauthorizedException);
      await expect(service.login(loginDto)).rejects.toThrow('Credenciales inválidas');
    });
  });

  describe('getProfile', () => {
    it('should return user profile data', async () => {
      const result = await service.getProfile('temp-user-id');

      expect(result).toEqual({
        id: 'temp-user-id',
        email: 'admin@fashionstyle.com',
        name: 'Administrador',
        role: 'admin'
      });
    });
  });
});
