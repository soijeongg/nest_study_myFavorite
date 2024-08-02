import { Comment } from 'src/comment/entities/comment.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { Friend } from 'src/friend/entities/friend.entity';
import { Like } from 'src/like/entities/like.entity';
import { Posts } from 'src/post/entities/post.entities';
import {
  Column,
  Entity,
  DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  OneToMany,
} from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn({})
  userId: number;

  @Column({ unique: true })
  email: string;

  @Column('varchar', { length: 255, select: false })
  password: string;

  @Column('varchar', { length: 100 })
  username: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @DeleteDateColumn()
  deletedAt: Date | null;

  @OneToMany(() => Posts, (post) => post.user)
  posts: Posts[];

  @OneToMany(() => Favorite, favorite =>favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Comment, comment => comment.user)
  comments: Comment[];

  @OneToMany(() => Like, like => like.user)
  likes: Like[];

  @OneToMany(() => Friend, (friend) => friend.requester)
  friendsRequested: Friend[];

  @OneToMany(() => Friend, (friend) => friend.recipient)
  friendsReceived: Friend[];
}
