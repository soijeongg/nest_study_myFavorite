import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Posts } from '../../post/entities/post.entities';
import { User } from '../../user/entities/user.entities';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  content: string;

  @Column()
  anonymous: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Posts, (post) => post.comments)
  post: Posts;

  @ManyToOne(() => User, (user) => user.comments)
  user: User;
}
