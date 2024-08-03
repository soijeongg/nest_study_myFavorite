import { Like } from "../entities/like.entity"
import { User } from "src/user/entities/user.entities";
export interface IlikeService {
  createLikeService(postId: number, user: User): Promise<Like>;
  deleteLikeService(postId: number, user: User): Promise<boolean>;
  getAllLikeService(user: User): Promise<Like[]>;
  searchLikeService(searchTerm: string): Promise<Like[]>;
}