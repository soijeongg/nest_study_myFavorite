import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';
import { Posts } from './entities/post.entities';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { User } from 'src/user/entities/user.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Favorite, User])],
  controllers: [PostController],
  providers: [PostService, JwtAuthGuard],
  exports: [JwtAuthGuard],
})
export class PostModule {}
