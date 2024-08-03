import { User } from 'src/user/entities/user.entities';
import { CreatePostDto } from '../dto/create-post.dto';
import { UpdatePostDto } from '../dto/update-post.dto';
import { Posts } from '../entities/post.entities';
export interface IpostService {
  createPostService(
    createDto: CreatePostDto,
    imageUrl: string,
    user: User,
  ): Promise<Posts>;
  findAllPostService(): Promise<Posts[]>;
  findOnePostService(postId: number): Promise<Posts>;
  removePostService(postId: number, user: User): Promise<boolean>;
  searchPostService(searchTerm: string): Promise<Posts[]>;
  updatePostService(
    id: number,
    updatePostDto: UpdatePostDto,
    imageUrl: string | null,
    user: User,
  ): Promise<Posts>;
}
