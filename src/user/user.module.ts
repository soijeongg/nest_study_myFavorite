import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtConfigService } from 'src/config/jwt.config';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useClass: JwtConfigService,
      inject: [ConfigService],
    }),
  ], //모듈에서 사용할 레포지토리 등록
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}

//JwtModule nest에서 jwt 모듈의 비동기 방식으로 설정허기 위해 사용
//.env의 값을 가져오기 위해 configModule을 import해 환경변슈를 사용한다
//useClass: JwtConfigService를 사용해 jwt의 설정을 제공
