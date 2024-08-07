import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';
import { Posts } from './entities/post.entities';
import { Favorite } from '../favorite/entities/favorite.entity';
import { User } from '../user/entities/user.entities';

@Module({
  imports: [TypeOrmModule.forFeature([Posts, Favorite, User])],
  controllers: [PostController],
  providers: [PostService, JwtAuthGuard],
  exports: [JwtAuthGuard, PostService],
})
export class PostModule {}
