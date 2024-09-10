import { SubCategory } from "src/sub-categories/entities/sub-category.entity";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  categoriesId: number;

  @Column()
  categoriesName: string;

  @CreateDateColumn()
  createAt: Date;

  @DeleteDateColumn()
  deleteAt: Date;

  @OneToMany(() => SubCategory, (subCategories) => subCategories.categories)
  subCategories: SubCategory[];
}
