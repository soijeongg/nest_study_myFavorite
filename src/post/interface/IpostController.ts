import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Request, Response } from 'express';
import { Posts } from '../entities/post.entities';

export interface IpostController {
  createPost(
    file: Express.Multer.File,
    createPostDto: CreatePostDto,
    req: Request,
  ): Promise<Posts>;

  findAllPosts(): Promise<Posts[]>;

  findOnePost(id: string): Promise<Posts>;

  updatePost(
    id: string,
    updateDto: UpdatePostDto,
    req: Request,
    file?: Express.Multer.File,
  ): Promise<Posts>;

  removePost(id: string, res: Response, req: Request): Promise<void>;

  searchpost(content: string): Promise<Posts[] | Posts>;
}
