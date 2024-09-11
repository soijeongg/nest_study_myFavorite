import {
  Entity,
  Column,
  ManyToOne,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { Posts } from '../../post/entities/post.entities';
import { User } from '../../user/entities/user.entities';
import { Like } from 'src/like/entities/like.entity';

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  content: string;

  @Column({default: false})
  anonymous: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date | null;

  @ManyToOne(() => Posts, (post) => post.comments)
  post: Posts;

  @OneToMany(() => Like, (like) => like.comment)
  likes: Like[];

  @ManyToOne(() => User, (user) => user.comments)
  user: User;
}
