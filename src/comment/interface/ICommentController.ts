import { CreateCommentDto } from '../dto/create-comment.dto';
import { UpdateCommentDto } from '../dto/update-comment.dto';
import { Request, Response } from "express";
import { Comment } from '../entities/comment.entity';

export interface ICommentController {
  createComment(
    createDto: CreateCommentDto,
    postId: string,
    req: Request,
  ): Promise<Comment>;
  updateComment(
    postId: string,
    commentId: string,
    updateDto: UpdateCommentDto,
    req: Request,
  ): Promise<Comment>;

  removeComment(postId: string, commentId: string, req: Request, res:Response): Promise<boolean>;
}