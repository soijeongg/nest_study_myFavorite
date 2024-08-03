import { Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';

@Module({
  controllers: [FavoriteController],
  providers: [FavoriteService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class FavoriteModule {}
