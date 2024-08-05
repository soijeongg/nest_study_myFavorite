import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Favorite } from './entities/favorite.entity';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([Favorite]), UserModule],
  controllers: [FavoriteController],
  providers: [FavoriteService, JwtAuthGuard],
  exports: [JwtAuthGuard, FavoriteService],
})
export class FavoriteModule {}
