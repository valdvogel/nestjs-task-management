import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialDto } from './dto/auth-credentials.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UserRepository) private readonly userRepository: UserRepository,
  ){}

  async signUp(authCredential: AuthCredentialDto): Promise<void> {
    return this.userRepository.signUp(authCredential);
  }

  async signIn(authCredentialDto: AuthCredentialDto): Promise<string>{
    const username =  await this.userRepository.validatUserPassword(authCredentialDto);

    if(!username){
      throw new UnauthorizedException('Invalid Credentials!');
    }

    return username;

  }
}
