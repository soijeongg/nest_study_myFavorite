import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { User } from './user/entities/user.entities';
import { Posts } from './post/entities/post.entities';
import { Like } from './like/entities/like.entity';
import { Favorite } from './favorite/entities/favorite.entity';
import { Friend } from './friend/entities/friend.entity';
import { Category } from './categories/entities/category.entity';
import { SubCategory } from './sub-categories/entities/sub-category.entity';
import { SubSubCategory } from './sub-sub-categories/entities/sub-sub-category.entity';
import { userFavorite } from './user/entities/userFavorite.entities';
import { FriendRequest } from './friend/entities/friendRequests.entity';
import { userFriends } from './friend/entities/userFriends.entity';
import { Comment } from './comment/entities/comment.entity';
import { TokenBlacklist } from './user/entities/tokenBlacklist';

ConfigModule.forRoot(); // .env 파일에서 환경 변수를 로드

const configService = new ConfigService();

//TypeOrmModuleAsyncOptions typeORM을 비동기적으로 사용 ->모듈 구성시 동젃으로 설정값 생성해 모듈에 주입
export const dataSourceOptions: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule], //ConfigModule를 import해서 환경변수 사용할수있게됨(로드)
  useFactory: async () => ({
    //설정객체를 동적으로 생성 configService를 주입받음
    type: 'postgres',
    host: configService.get<string>('TYPEORM_HOST'),
    port: configService.get<number>('TYPEORM_PORT'),
    username: configService.get<string>('TYPEORM_USERNAME'),
    password: configService.get<string>('TYPEORM_PASSWORD'),
    database: configService.get<string>('TYPEORM_DATABASE'),
    synchronize: configService.get<boolean>('TYPEORM_SYNCHRONIZE'),
    entities: [User, Posts, Like, Favorite, Friend, Comment, TokenBlacklist, Category, SubCategory, SubSubCategory, userFavorite, userFriends, FriendRequest],
  }),
  inject: [ConfigService], //환경변수에서 설정값 가져옴
};
