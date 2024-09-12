import { Module } from '@nestjs/common';
import { FriendService } from './friend.service';
import { FriendController } from './friend.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Friend } from './entities/friend.entity';
import { userFriends } from './entities/userFriends.entity';
import { FriendRequest } from './entities/friendRequests.entity';
import { UserModule } from '../user/user.module';
import { JwtAuthGuard } from '../Guard/jwt.guard';

@Module({
  imports: [TypeOrmModule.forFeature([Friend,userFriends, FriendRequest]), UserModule],
  controllers: [FriendController],
  providers: [FriendService, JwtAuthGuard],
  exports: [FriendService],
})
export class FriendModule {}
