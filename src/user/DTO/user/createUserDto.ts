import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  Matches,
} from 'class-validator';

export enum userType {
  ADMIN = 'admin',
  MEMBER = 'member',
}
export class createUserDTO {
  @IsEmail()
  @ApiProperty({ required: true, example: '12345@naver.com' })
  email: string;

  @IsString()
  @MaxLength(12)
  @MinLength(5)
  @ApiProperty({ required: true, example: '12345' })
  @Matches(/^[a-zA-Z0-9]{8,20}$/, {
    message: '비밀번호는 알파벳과 숫자만 가능하며 5자 이상 12자 이하입니다',
  })
  password: string;

  @IsString()
  @MaxLength(10)
  @MinLength(2)
  @Matches(/^.{2,10}$/, {
    message: '닉네임은 최대10자 최소2자 이상입니다',
  })
  @ApiProperty({ required: true, example: 'username' })
  username: string;

  status: userType;

  profilePic: string;
}
