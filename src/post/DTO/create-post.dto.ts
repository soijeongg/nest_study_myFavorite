import { IsString, IsNumber, isBoolean } from 'class-validator';
import { PostType } from '../entities/post.entities';
export class CreatePostDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  anonymous?: boolean;

  postType?: PostType;
}
