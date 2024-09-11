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

export enum PostType {
  notice = 'notice',
  normal = 'normal',
}
@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  postId: number;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string | null;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  deleteAt: Date | null;

  @Column({default: false})
  anonymous: boolean;

  @Column({
    type: 'enum',
    enum: PostType,
    default: PostType.normal,
  })
  postType: PostType;

  @ManyToOne(() => User, (user) => user.posts)
  user: User;

  @ManyToOne(() => Favorite, (favorite) => favorite.posts)
  favorite: Favorite;

  @OneToMany(() => Like, (like) => like.post)
  likes: Like[];

  @OneToMany(() => Comment, (Comment) => Comment.post)
  comments: Comment[];
}
