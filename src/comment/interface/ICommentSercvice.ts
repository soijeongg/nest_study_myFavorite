import { CreateCommentDto } from "../dto/create-comment.dto"
import { UpdateCommentDto } from "../dto/update-comment.dto"
import { User } from "src/user/entities/user.entities"
import { Comment } from "../entities/comment.entity"

export interface ICommentService {
  createCommentService(createDto:CreateCommentDto, user:User, postId:number): Promise<Comment>;
  updateCommentService(postId:number,commentId:number, updateDto:UpdateCommentDto, user:User): Promise<Comment>;
  findOneService(commentId: number): Promise<Comment>;
  removeComment(postId: number, CommentId: number, user:User): Promise<boolean>;
}
