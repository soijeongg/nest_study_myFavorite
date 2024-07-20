import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsEmail, MinLength, MaxLength } from 'class-validator';

export class createUserDTO {
  @IsEmail()
  @ApiProperty({ required: true, example: '12345@naver.com' })
  email: string;

  @IsString()
  @MaxLength(20)
  @MinLength(5)
  @ApiProperty({ required: true, example: '12345' })
  password: string;

  @IsString()
  @MaxLength(10)
  @MinLength(2)
  @ApiProperty({ required: true, example: 'username' })
  username: string;
}
