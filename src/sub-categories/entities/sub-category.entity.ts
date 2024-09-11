import { Category } from "src/categories/entities/category.entity";
import { Entity, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from "typeorm";
import { SubSubCategory } from "src/sub-sub-categories/entities/sub-sub-category.entity";

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  subcategoriesId: number;

  @Column()
  subCategoryName: string;

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => Category, (Category) => Category.subCategories)
  Category: Category;

  @OneToMany(
    () => SubSubCategory,
    (SubSubCategory) => SubSubCategory.subCategory,
  )
  subSubCategories: SubSubCategory[];
}
