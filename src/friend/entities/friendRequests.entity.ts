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
export class FriendRequest {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user)
  requester: User; // 친구신청을 한 사람

  @ManyToOne(() => User, (user) => user)
  recipient: User; //친구 신청을 받은 사람

  @Column({
    type: 'enum',
    enum: ['pending', 'accepted', 'rejected'],
    default: 'pending',
  })
  status: 'pending' | 'accepted' | 'rejected'; //신청중, 수락, 거절

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deleteAt: Date | null;
}
