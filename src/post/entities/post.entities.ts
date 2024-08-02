import { Comment } from 'src/comment/entities/comment.entity';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { Like } from 'src/like/entities/like.entity';
import { User } from 'src/user/entities/user.entities';
import {
  Column,
  PrimaryGeneratedColumn, Entity, DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  PostsId: number;

  @Column()
  name: string;

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

  @ManyToOne(() => Favorite, favorite => favorite.posts)
  favorite: Favorite;

  @OneToMany(() => Like, like =>like.post)
  likes: Like;

  @OneToMany(() => Comment, Comment =>Comment.post)
  comments: Comment;
}
