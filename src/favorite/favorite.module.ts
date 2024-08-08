import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { UserModule } from '../user/user.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
    UserModule, //엔티티 사용해서
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, JwtAuthGuard],
  exports: [JwtAuthGuard, FavoriteService],
})
export class FavoriteModule {}
