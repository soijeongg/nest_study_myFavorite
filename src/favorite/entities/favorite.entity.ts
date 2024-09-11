import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToOne,
  UpdateDateColumn,
  CreateDateColumn,
  DeleteDateColumn,
} from 'typeorm';
import { Posts } from '../../post/entities/post.entities';
import { userFavorite } from 'src/user/entities/userFavorite.entities';
import { SubSubCategory } from 'src/sub-sub-categories/entities/sub-sub-category.entity';

@Entity()
export class Favorite {
  @PrimaryGeneratedColumn()
  favoriteId: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @OneToMany(() => userFavorite, (userFavorite) => userFavorite.Favorite)
  userFavorite: userFavorite[];

  @ManyToOne(() => SubSubCategory, (SubSubCategory) => SubSubCategory.favorites)
  subSubCategory: SubSubCategory;

  @OneToMany(() => Posts, (post) => post.favorite)
  posts: Posts[];
}
