import { User } from "src/user/entities/user.entities";

export class CreateFriendDto {
  recipientName: string;
  status?: string;
}
