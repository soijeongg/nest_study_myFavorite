import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { PostModule } from 'src/post/post.module';
import { FavoriteModule } from 'src/favorite/favorite.module';
@Module({
  imports: [PostModule, FavoriteModule ],
  providers: [SchedulerService]
})
export class SchedulerModule {}
