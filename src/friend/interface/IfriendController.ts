import { CreateFriendDto } from "../dto/create-friend.dto";
import { Request, Response } from "express";
import { Friend } from "../entities/friendRequests.entity";
import { UpdateFriendDto } from "../dto/update-friend.dto";
export interface IfriendController {
  createFriendController(createDto: CreateFriendDto, req:Request): Promise<Friend>;
  updateFriendController(updateDto:UpdateFriendDto, req:Request): Promise<Friend>;
  getAllFriendController(username: string): Promise<Friend[]>;
  searchFriendController(searchTerm: string,username: string): Promise<Friend[]>
  deleteFriendController(username: string, req: Request, res: Response): Promise<void>;
}
