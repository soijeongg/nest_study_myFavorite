import { IsString, IsEmail } from "class-validator";

export class createUserDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsString()
  username: string;
}
