// TODO: 친구신청, 친구수랑(상태바꾸기), 친구거절(상태바꾸기), 친구삭제, 내친구보기, 내친구 검색, 남의 친구보기, 남의 친구 검색

import { User } from "src/user/entities/user.entities";
import { Friend } from "../entities/friendRequests.entity";
import { CreateFriendDto } from "../dto/create-friend.dto";
import { UpdateFriendDto } from "../dto/update-friend.dto";

export interface IfriendService {
  createFriendService(createDto: CreateFriendDto, user: User): Promise<Friend>;
  updateFriendService(updateDto: UpdateFriendDto, user: User): Promise<Friend>;
  getAllFriendService(username: string): Promise<Friend[]>;
  deleteFriendService(user: User, username: string): Promise<boolean>;
  searchFriendService(searchTerm: string, username: string): Promise<Friend[]>;
}
