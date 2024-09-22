import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
  OneToMany,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entities';
import { userFriends } from './userFriends.entity';

@Entity()
export class Friend {
  @PrimaryGeneratedColumn()
  friendId: number;

  @OneToMany(() => userFriends, (userFriends) => userFriends.friend)
  userFriends: userFriends;

  @CreateDateColumn()
  createdAt: Date; // 친구 관계가 생성된 일시

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null; // 친구 관계가 삭제된 일시 (논리 삭제)
}
