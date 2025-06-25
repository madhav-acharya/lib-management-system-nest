import { Injectable } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService, private jwtService: JwtService) {}

  async authenticateUser(loginDto: LoginDto)
  {
    try {
      const user = await this.usersService.findUserByEmail(loginDto.email);
      if (!user.data) {
        return {
          success: false,
          message: 'User not found',
          statusCode: 404,
        };
      }

      const isPasswordMatched = await bcrypt.compare(loginDto.password, user.data.password);
      if (!isPasswordMatched) {
        return {
          success: false,
          message: 'Invalid credentials',
          statusCode: 401,
        };
      }

      const jwtToken = this.jwtService.sign({
        id: user.data.id,
        email: user.data.email,
        role: user.data.role,
      });

      if (!jwtToken) {
        return {
          success: false,
          message: 'Token generation failed',
          statusCode: 500,
        };
      }
      
      return {
        success: true,
        message: 'Authentication successful',
        statusCode: 200,
        token: jwtToken,
        data: {
          id: user.data.id,
          name: user.data.name,
          email: user.data.email,
          role: user.data.role,
          phoneNumber: user.data.phoneNumber,
          address: user.data.address,
        },
      };
    } catch (error) {
      return {
        success: false,
        message: 'Authentication failed',
        statusCode: 500,
        error: error.message,
      };
      
    }
  }
}
