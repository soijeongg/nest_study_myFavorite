import { IsString, MinLength, MaxLength, IsOptional } from 'class-validator';

export class updateUserDTO {
  email: string;

  @IsString()
  @MaxLength(20)
  @MinLength(5)
  @IsOptional()
  password?: string;

  @IsString()
  @MaxLength(10)
  @MinLength(2)
  @IsOptional()
  username?: string;
}
