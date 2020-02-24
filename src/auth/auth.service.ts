import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './jwt.payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
    private jwtService: JwtService
  ){}

  async signUp(authCredential: AuthCredentialDto): Promise<void> {
    return this.userRepository.signUp(authCredential);
  }

  async signIn(authCredentialDto: AuthCredentialDto): Promise<{accessToken: string}> {
    const username =  await this.userRepository.validatUserPassword(authCredentialDto);

    if(!username){
      throw new UnauthorizedException('Invalid Credentials!');
    }

    const payload: JwtPayload = {username};
    const accessToken = await this.jwtService.sign(payload);

    return  { accessToken };

  }
}
