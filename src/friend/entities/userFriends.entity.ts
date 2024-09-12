import { PrimaryGeneratedColumn, Column, ManyToOne, Entity, OneToMany, CreateDateColumn, DeleteDateColumn } from "typeorm";
import { User } from "src/user/entities/user.entities";
import { Friend } from "./friend.entity";

@Entity()
export class userFriends {
  @PrimaryGeneratedColumn()
  userFriendId: number; // 친구 관계의 고유 ID

  @ManyToOne(() => User, (user) => user)
  user: User; // 유저 본인

  @ManyToOne(() => Friend, (friend) => friend.userFriends)
  friend: Friend;

  @DeleteDateColumn({ nullable: true })
  deletedAt: Date | null;

  @CreateDateColumn()
  createAt: Date;
}
