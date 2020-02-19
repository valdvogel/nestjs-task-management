import { Repository, EntityRepository } from "typeorm";
import { User } from './user.entity';
import { AuthCredentialDto } from "./dto/auth-credentials.dto";
import { ConflictException, InternalServerErrorException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

@EntityRepository(User)
export class UserRepository extends Repository<User>{
  async signUp(authCredentialDto: AuthCredentialDto): Promise<void> {
    const { username, password } = authCredentialDto;

    const salt = await bcrypt.genSalt();

    const user = new User();
    user.salt = salt;
    user.username = username;
    user.password = await this.hashPassword(password, salt);
    console.log(user.password);

    try {
      await user.save();
    } catch (e) {
      if (e.code === "ER_DUP_ENTRY") {
        throw new ConflictException("Username already exists!");
      } else {
        console.log(e.code);
        throw new InternalServerErrorException();
      }
      console.log(e.code);
    }
  }

  private async hashPassword(pass: string, hash: string): Promise<string> {
    return bcrypt.hash(pass, hash);
  }

}