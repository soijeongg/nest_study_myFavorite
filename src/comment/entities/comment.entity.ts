import {
  Entity,
  Column,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
 } from "typeorm";
import { Posts } from "src/post/entities/post.entities";
import { User } from "src/user/entities/user.entities";

@Entity()
export class Comment {
  @PrimaryGeneratedColumn()
  commentId: number;

  @Column()
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Posts, post => post.comments)
  post: Posts;

  @ManyToOne(() => User, user => user.comments)
  user: User;
}
