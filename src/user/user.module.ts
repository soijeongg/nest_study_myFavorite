import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from '../config/jwt.strategy';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { adminGuard } from '../Guard/adminGuard';
import { JwtConfigService } from '../config/jwt.config';
import { TokenBlacklist } from './entities/tokenBlacklist';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { userFavorite } from './entities/userFavorite.entities';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, TokenBlacklist, userFavorite]), // 1. User 엔티티에 대한 TypeORM 레포지토리를 모듈에 등록
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      // 2. 비동기 방식으로 JwtModule을 등록
      imports: [ConfigModule], //환경변수 사용
      useClass: JwtConfigService, // JwtConfigService를 사용하여 설정 제공
      inject: [ConfigService],
    }),
    MulterModule.register({
      storage: diskStorage({
        destination: './profile', // 파일 저장 경로
        filename: (req, file, callback) => {
          // 원래 파일명과 확장자를 유지한 채 파일 저장
          const fileExtName = extname(file.originalname); // 확장자 추출
          const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExtName}`; // 유니크한 파일 이름 생성
          callback(null, fileName); // 파일 이름 설정
        },
      }),
    }),
    ConfigModule,
    TypeOrmModule.forFeature([TokenBlacklist]),
  ], //모듈에서 사용할 레포지토리 등록
  controllers: [UserController],
  providers: [UserService, JwtStrategy, JwtAuthGuard, adminGuard],
  exports: [JwtModule, PassportModule, UserService, JwtAuthGuard, adminGuard, TypeOrmModule, UserService],
})
export class UserModule {}

//JwtModule nest에서 jwt 모듈의 비동기 방식으로 설정허기 위해 사용
//.env의 값을 가져오기 위해 configModule을 import해 환경변슈를 사용한다
//useClass: JwtConfigService를 사용해 jwt의 설정을 제공
