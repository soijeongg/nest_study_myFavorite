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
import { userFavorite } from 'src/user/entities/userFavorite.entities';
import { SubSubCategory } from 'src/sub-sub-categories/entities/sub-sub-category.entity';

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

  @OneToMany(() => userFavorite, (userFavorite) => userFavorite.Favorite)
  userFavorite: userFavorite[];

  @ManyToOne(() => SubSubCategory, (SubSubCategory) => SubSubCategory.favorite)
  subSubCategory: SubSubCategory;

  @OneToMany(() => Posts, (post) => post.favorite)
  posts: Posts[];
}
