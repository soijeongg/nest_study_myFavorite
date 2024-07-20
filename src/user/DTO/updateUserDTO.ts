import { IsString, MinLength, MaxLength } from 'class-validator';

export class updateUserDTO {
  @IsString()
  @MaxLength(20)
  @MinLength(5)
  password: string;

  @IsString()
  @MaxLength(10)
  @MinLength(2)
  username: string;
}
