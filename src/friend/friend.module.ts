import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friendRequests.entity';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from '../Guard/jwt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Friend]), UserModule],
  controllers: [FriendController],
  providers: [FriendService, JwtAuthGuard],
  exports: [FriendService],
})
export class FriendModule {}
