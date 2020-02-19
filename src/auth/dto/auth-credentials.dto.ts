import { IsString, MaxLength, MinLength, Matches } from "class-validator";

export class AuthCredentialDto {
  @IsString()
  @MaxLength(20)
  @MinLength(4)
  username: string;
  @IsString()
  @MaxLength(20)
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {message: 'password too weak'})
  password: string;

}