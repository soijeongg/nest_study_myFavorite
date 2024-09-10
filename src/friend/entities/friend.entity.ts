import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entities';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user)
  user1: User; // 친구 관계의 유저 1

  @ManyToOne(() => User, (user) => user)
  user2: User; // 친구 관계의 유저 2

  @CreateDateColumn()
  createdAt: Date; // 친구 관계가 생성된 일시

  @Column({ nullable: true })
  deletedAt: Date | null; // 친구 관계가 삭제된 일시 (논리 삭제)
}
