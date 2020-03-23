import { Repository, EntityRepository } from "typeorm";
import { User } from './user.entity';
import { AuthCredentialDto } from './dto/auth-credentials.dto';
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from 'bcryptjs';

@EntityRepository(User)
export class UserRepository extends Repository<User>{
  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;

    const salt = await bcrypt.genSalt();

    const user = this.create(); //new User();
    user.salt = salt;
    user.username = username;
    user.password = await this.hashPassword(password, salt);
    try {
      await user.save();
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") {
        throw new ConflictException("Username already exists!");
      } else {
        throw new InternalServerErrorException();
      }
      
    }
  }

  async validatUserPassword(authCredentialDto: AuthCredentialDto): Promise<string> {
    const {username, password} = authCredentialDto;
    const user = await this.findOne({username});

    if(user &&  await user.validatePassword(password)){
      return user.username;
    }else {
      return null;
    }
  }

  private async hashPassword(pass: string, hash: string): Promise<string> {
    return bcrypt.hash(pass, hash);
  }

}