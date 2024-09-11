import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, DeleteDateColumn, CreateDateColumn } from 'typeorm';
import { Posts } from '../../post/entities/post.entities';
import { Comment } from 'src/comment/entities/comment.entity';
import { User } from '../../user/entities/user.entities';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  likeId: number;

  @ManyToOne(() => Posts, (post) => post.likes)
  post: Posts;

  @ManyToOne(() => Comment, (comment) => comment.likes)
  comment: Comment;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deleteAt: Date | null;
}
