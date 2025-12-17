import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            login: jest.fn(),
            getProfile: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should call authService.login with correct parameters', async () => {
      const loginDto: LoginDto = {
        email: 'admin@fashionstyle.com',
        password: 'admin123'
      };

      const expectedResult = {
        access_token: 'mock-jwt-token',
        user: {
          id: 'temp-user-id',
          email: 'admin@fashionstyle.com',
          name: 'Administrador',
          role: 'admin',
        },
      };

      jest.spyOn(authService, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(loginDto);

      expect(authService.login).toHaveBeenCalledWith(loginDto);
      expect(result).toEqual(expectedResult);
    });
  });

  describe('getProfile', () => {
    it('should call authService.getProfile with user id from request', async () => {
      const mockRequest = {
        user: {
          sub: 'temp-user-id'
        }
      };

      const expectedResult = {
        id: 'temp-user-id',
        email: 'admin@fashionstyle.com',
        name: 'Administrador',
        emailVerified: null,
        image: null,
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      jest.spyOn(authService, 'getProfile').mockResolvedValue(expectedResult);

      const result = await controller.getProfile(mockRequest);

      expect(authService.getProfile).toHaveBeenCalledWith('temp-user-id');
      expect(result).toEqual(expectedResult);
    });
  });
});
