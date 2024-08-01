import { IsString, IsEmail } from 'class-validator';

export class loginDTO {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}
