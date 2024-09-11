import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { CommentModule } from 'src/comment/comment.module';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), PostModule, UserModule, CommentModule],
  controllers: [LikeController],
  providers: [LikeService, JwtAuthGuard],
  exports: [LikeService],
})
export class LikeModule {}
