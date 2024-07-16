import { IsString } from 'class-validator';

export class updateUserDTO {
  @IsString()
  password: string;

  @IsString()
  username: string;
}
