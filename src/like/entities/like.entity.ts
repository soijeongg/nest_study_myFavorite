import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Posts } from '../../post/entities/post.entities';
import { User } from '../../user/entities/user.entities';

@Entity()
export class Like {
  @PrimaryGeneratedColumn()
  likeId: number;

  @ManyToOne(() => Posts, (post) => post.likes)
  post: Posts;

  @ManyToOne(() => User, (user) => user.likes)
  user: User;

  @Column()
  createdAt: Date;
}
