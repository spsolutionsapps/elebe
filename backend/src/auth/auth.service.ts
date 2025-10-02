import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
// import { InjectRepository } from '@nestjs/typeorm';
// import { Repository } from 'typeorm';
// import * as bcrypt from 'bcryptjs';
// import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    // @InjectRepository(User)
    // private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    // TODO: Implementar cuando tengamos base de datos
    // const user = await this.usersRepository.findOne({ where: { email } });
    
    // if (user && await bcrypt.compare(password, user.password)) {
    //   const { password, ...result } = user;
    //   return result;
    // }
    
    // Temporal: Usuario hardcodeado para pruebas
    if (email === 'admin@fashionstyle.com' && password === 'admin123') {
      return {
        id: 'temp-user-id',
        email: 'admin@fashionstyle.com',
        name: 'Administrador',
        role: 'admin'
      };
    }
    
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.validateUser(loginDto.email, loginDto.password);
    
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const payload = { email: user.email, sub: user.id, role: user.role };
    
    return {
      access_token: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getProfile(userId: string) {
    // TODO: Implementar cuando tengamos base de datos
    // const user = await this.usersRepository.findOne({ where: { id: userId } });
    // if (!user) {
    //   throw new UnauthorizedException('Usuario no encontrado');
    // }
    
    // const { password, ...result } = user;
    // return result;
    
    // Temporal: Retornar usuario hardcodeado
    return {
      id: 'temp-user-id',
      email: 'admin@fashionstyle.com',
      name: 'Administrador',
      role: 'admin'
    };
  }
}
