import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  Column,
  DeleteDateColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entities';

export enum statusType {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
}
@Entity()
export class FriendRequest {
  @PrimaryGeneratedColumn()
  friendRequestId: number;

  @ManyToOne(() => User, (user) => user.sentFriendRequests)
  requester: User; // 친구신청을 한 사람

  @ManyToOne(() => User, (user) => user.receivedFriendRequests)
  recipient: User; //친구 신청을 받은 사람

  @Column({
    type: 'enum',
    enum: statusType,
    default: statusType.PENDING,
  })
  status: statusType;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deleteAt: Date | null;
}
