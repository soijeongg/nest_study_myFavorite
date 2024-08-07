import { Module } from '@nestjs/common';
import { LikeService } from './like.service';
import { LikeController } from './like.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { PostModule } from '../post/post.module';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from '../Guard/jwt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Like]), PostModule, UserModule],
  controllers: [LikeController],
  providers: [LikeService, JwtAuthGuard],
  exports: [LikeService],
})
export class LikeModule {}
