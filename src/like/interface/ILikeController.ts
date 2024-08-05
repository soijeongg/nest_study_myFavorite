import { Like } from '../entities/like.entity';
import { Request, Response } from 'express';
export interface ILikeController {
  createLikeController(postId: string, req: Request): Promise<Like>;
  deleteLikeController(
    postId: string,
    req: Request,
    res: Response,
  ): Promise<void>;
  getAllLikeController(req: Request, res: Response): Promise<Like[]>;
  searchLikeController(searchTerm: string, username: string): Promise<Like[]>;
  getOneLikeController(username: string): Promise<Like[]>;
}
