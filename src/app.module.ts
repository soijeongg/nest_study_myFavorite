import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { dataSourceOptions } from './data-source';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }), //전역모듈로 설정해서 전체에서 환경변수 사용할 수 있음
    TypeOrmModule.forRootAsync(dataSourceOptions), //비동기적으로 typeORM설정
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
