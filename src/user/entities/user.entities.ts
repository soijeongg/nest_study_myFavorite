import { Comment } from '../../comment/entities/comment.entity';
import { userFavorite } from './userFavorite.entities';
import { userFriends } from 'src/friend/entities/userFriends.entity';
import { Like } from '../../like/entities/like.entity';
import { Posts } from '../../post/entities/post.entities';
import { FriendRequest } from 'src/friend/entities/friendRequests.entity';
import {
  Column,
  Entity,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

export enum userType {
  ADMIN = 'admin',
  MEMBER = 'member',
}
@Entity()
export class User {
  @PrimaryGeneratedColumn({})
  userId: number;

  @Column({ unique: true })
  email: string;

  @Column('varchar', { length: 255, select: false })
  password: string;

  @Column({ unique: true })
  username: string;

  @Column({
    type: 'enum',
    enum: userType,
    default: userType.MEMBER,
  })
  status: userType;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];

  @OneToMany(() => userFavorite, (userFavorite) => userFavorite.user)
  userFavorites: userFavorite[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, (like) => like.user)
  likes: Like[];

  @Column()
  profilePic: string;

  // 친구 관계
  @OneToMany(() => userFriends, (userFriends) => userFriends.user)
  friends: userFriends[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.requester)
  sentFriendRequests: FriendRequest[];

  // 내가 받은 친구 요청들
  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.recipient)
  receivedFriendRequests: FriendRequest[];
}
