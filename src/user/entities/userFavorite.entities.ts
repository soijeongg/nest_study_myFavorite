import { Entity, Column, ManyToOne, PrimaryGeneratedColumn, OneToMany, DeleteDateColumn } from "typeorm";
import { User } from "./user.entities";
import { Favorite } from "src/favorite/entities/favorite.entity";

@Entity()
export class userFavorite {
  @PrimaryGeneratedColumn()
  userFavoriteId: number;

  @ManyToOne(() => User, (user) => user.userFavorites)
  user: User;

  @ManyToOne(() => Favorite, (Favorite) => Favorite.userFavorite)
  favorite: Favorite;

  @DeleteDateColumn()
  deleteAt: Date | null;
}
