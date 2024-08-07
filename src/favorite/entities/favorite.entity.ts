import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Posts } from '../../post/entities/post.entities';
import { User } from '../../user/entities/user.entities';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  favoriteId: number;

  @Column()
  categories: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  imageUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.favorites)
  user: User;

  @OneToMany(() => Posts, (post) => post.favorite)
  posts: Posts[];
}
