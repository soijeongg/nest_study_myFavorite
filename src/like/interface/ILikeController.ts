import { Like } from '../entities/like.entity';
import { Request, Response } from 'express';
export interface ILikeController {
  createLikeController(postId: string): Promise<Like>;
  deleteLikeController(postId: string): Promise<void>;
  getAllLikeController(req: Request, res: Response): Promise<Like[]>;
  searchLikeController(searchTerm: string): Promise<Like[]>;
}
