import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../config/jwt.strategy';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';
import { JwtConfigService } from 'src/config/jwt.config';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // 1. User 엔티티에 대한 TypeORM 레포지토리를 모듈에 등록
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      // 2. 비동기 방식으로 JwtModule을 등록
      imports: [ConfigModule], //환경변수 사용
      useClass: JwtConfigService, // JwtConfigService를 사용하여 설정 제공
      inject: [ConfigService],
    }),
    ConfigModule,
  ], //모듈에서 사용할 레포지토리 등록
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtAuthGuard],
  exports: [JwtModule, PassportModule, UserService, JwtAuthGuard],
})
export class UserModule {}

//JwtModule nest에서 jwt 모듈의 비동기 방식으로 설정허기 위해 사용
//.env의 값을 가져오기 위해 configModule을 import해 환경변슈를 사용한다
//useClass: JwtConfigService를 사용해 jwt의 설정을 제공
