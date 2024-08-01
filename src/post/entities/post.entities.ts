import {
  Column,
  PrimaryGeneratedColumn, Entity, DeleteDateColumn,
  UpdateDateColumn,
  CreateDateColumn,
  ManyToOne
} from 'typeorm';

@Entity()
export class Posts {
  @PrimaryGeneratedColumn()
  PostsId: number;

  @Column()
  FavoriteName: string;

  @Column()
  content: string;

  @CreateDateColumn()
  createAt: Date;

  @UpdateDateColumn()
  updateAt: Date | null;
}
