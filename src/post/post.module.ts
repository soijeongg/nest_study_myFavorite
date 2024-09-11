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
import { SubSubCategory } from 'src/sub-sub-categories/entities/sub-sub-category.entity';
import { UserModule } from 'src/user/user.module';
import { SubSubCategoriesModule } from 'src/sub-sub-categories/sub-sub-categories.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, Favorite, User, TokenBlacklist, SubSubCategory]),
    MulterModule.register({
      dest: './posts',
    }),
    UserModule,
    SubSubCategoriesModule,
  ],
  controllers: [PostController],
  providers: [PostService, JwtAuthGuard, UserService, JwtService],
  exports: [JwtAuthGuard, PostService],
})
export class PostModule {}
