import { Favorite } from "src/favorite/entities/favorite.entity";
import { SubCategory } from "src/sub-categories/entities/sub-category.entity";
import { Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class SubSubCategory {
  @PrimaryGeneratedColumn()
  subSubCategoriesId: number;

  @Column()
  subSubCategoriesName: string;

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @OneToMany(() => Favorite, (Favorite) => Favorite.subSubCategory)
  favorite: Favorite[];

  @ManyToOne(() => SubCategory, (SubCategory) => SubCategory.subSubCategories)
  SubCategory: SubCategory[];
}
