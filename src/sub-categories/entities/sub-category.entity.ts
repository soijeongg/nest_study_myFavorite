import { Category } from "src/categories/entities/category.entity";
import { Entity, Column, OneToMany, ManyToOne, PrimaryGeneratedColumn, CreateDateColumn, DeleteDateColumn } from "typeorm";
import { SubSubCategory } from "src/sub-sub-categories/entities/sub-sub-category.entity";

@Entity()
export class SubCategory {
  @PrimaryGeneratedColumn()
  subcategoriesId: number;

  @Column()
  subCategoriesName: string;

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @ManyToOne(() => Category, (Category) => Category.subCategories)
  categories: Category;

  @OneToMany(
    () => SubSubCategory,
    (SubSubCategory) => SubSubCategory.SubCategory,
  )
  subSubCategories: SubSubCategory[];
}
