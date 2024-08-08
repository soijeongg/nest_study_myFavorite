import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { Posts } from './entities/post.entities';
import { Favorite } from '../favorite/entities/favorite.entity';
import { User } from '../user/entities/user.entities';
import { UserService } from 'src/user/user.service';
import { TokenBlacklist } from 'src/user/entities/tokenBlacklist';
import { JwtService } from '@nestjs/jwt';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, Favorite, User, TokenBlacklist]),
    MulterModule.register({
      dest: './uploads',
    }),
  ],
  controllers: [PostController],
  providers: [PostService, JwtAuthGuard, UserService, JwtService],
  exports: [JwtAuthGuard, PostService],
})
export class PostModule {}
