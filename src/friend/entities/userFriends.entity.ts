import { PrimaryGeneratedColumn, Column, ManyToOne, Entity } from "typeorm";
import { User } from "src/user/entities/user.entities";
import { Friend } from "./friend.entity";

@Entity()
export class userFriends {
  @PrimaryGeneratedColumn()
  id: number; // 친구 관계의 고유 ID

  @ManyToOne(() => User, (user) => user)
  user: User; // 유저 본인

  @ManyToOne(() => Friend, (friend) => friend.user2)
  friend: User;

  @Column({ nullable: true })
  deletedAt: Date | null;
}
