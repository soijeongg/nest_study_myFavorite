import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { UserModule } from '../user/user.module';
import { MulterModule } from '@nestjs/platform-express';
import { User } from 'src/user/entities/user.entities';
import { SubSubCategoriesModule } from 'src/sub-sub-categories/sub-sub-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite, User]),
    UserModule, //엔티티 사용해서
    SubSubCategoriesModule,
  ],
  controllers: [FavoriteController],
  providers: [FavoriteService, JwtAuthGuard],
  exports: [JwtAuthGuard, FavoriteService],
})
export class FavoriteModule {}
