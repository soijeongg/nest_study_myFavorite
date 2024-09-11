import { Category } from "src/categories/entities/category.entity";
import { Favorite } from "src/favorite/entities/favorite.entity";
import { SubCategory } from "src/sub-categories/entities/sub-category.entity";
import { Entity, OneToMany, ManyToOne, PrimaryGeneratedColumn, Column, CreateDateColumn, DeleteDateColumn } from "typeorm";

@Entity()
export class SubSubCategory {
  @PrimaryGeneratedColumn()
  subSubCategoryId: number;

  @Column()
  subSubCategoryName: string;

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  deleteAt: Date | null;

  @OneToMany(() => Favorite, (Favorite) => Favorite.subSubCategory)
  favorites: Favorite[];

  @ManyToOne(() => SubCategory, (SubCategory) => SubCategory.subSubCategories)
  subCategory: SubCategory;
}
