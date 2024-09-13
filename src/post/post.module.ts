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
import { FavoriteModule } from 'src/favorite/favorite.module';
import { diskStorage } from 'multer';
import { extname } from 'path';
@Module({
  imports: [
    TypeOrmModule.forFeature([Posts, Favorite, User, TokenBlacklist, SubSubCategory]),
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
    UserModule,
    SubSubCategoriesModule,
    FavoriteModule,
  ],
  controllers: [PostController],
  providers: [PostService, JwtAuthGuard, UserService, JwtService],
  exports: [JwtAuthGuard, PostService],
})
export class PostModule {}
