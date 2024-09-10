import { Comment } from '../../comment/entities/comment.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';
import { Like } from '../../like/entities/like.entity';
import { User } from '../../user/entities/user.entities';
import {
  Column,
  PrimaryGeneratedColumn,
  Entity,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date | null;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => Favorite, (favorite) => favorite.posts)
  favorite: Favorite;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (Comment) => Comment.post)
  comments: Comment[];
}
