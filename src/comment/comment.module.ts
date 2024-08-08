import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Comment } from './entities/comment.entity';
import { PostModule } from '../post/post.module';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklist } from 'src/user/entities/tokenBlacklist';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Comment, TokenBlacklist]),
    PostModule,
    UserModule,
  ],
  controllers: [CommentController],
  providers: [CommentService, UserService, JwtService],
  exports: [CommentService],
})
export class CommentModule {}
