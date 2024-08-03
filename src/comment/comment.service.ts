import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ICommentService } from './interface/ICommentSercvice';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from 'src/user/entities/user.entities';
import { PostService } from 'src/post/post.service';

@Injectable()
export class CommentService implements ICommentService {
  constructor(
    @InjectRepository(Comment) private CommentRepository: Repository<Comment>,
    private postService: PostService,
  ) {}

  async createCommentService(
    createCommentDto: CreateCommentDto,
    user: User,
    postId: number,
  ): Promise<Comment> {
    //먼저 포스트 아이디로 포스트를 찾는다
    const post = await this.postService.findOnePostService(+postId);
    const { content } = createCommentDto;
    if (!post) {
      throw new HttpException(
        '해당하는 포스트가 없습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    const comment = this.CommentRepository.create({
      content,
      user,
      post,
    });
    return await this.CommentRepository.save(comment);
  }
  /*

  findAll() {
    return `This action returns all comment`;
  }
     */

  async findOneService(commentId: number) {
    return this.CommentRepository.findOne({
      where: { commentId },
    });
  }

  async updateCommentService(
    postId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    //포스트를 검사하고 그 후 있다면 유저가 같은지 확인한다
    const post = await this.postService.findOnePostService(+postId);
    const { content } = updateCommentDto;
    if (!post) {
      throw new HttpException(
        '해당하는 포스트가 없습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    //코멘트를 검사한다
    const comment = await this.findOneService(commentId);
    if (!comment) {
      throw new HttpException(
        '해당하는 댓글이 없습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    //유저가 맞는지 검사한다
    if (comment.user != user) {
      throw new HttpException('자신의 댓글이 아닙니다', HttpStatus.BAD_REQUEST);
    }
    comment.content = content;
    return this.CommentRepository.save(comment);
  }

  async removeComment(postId: number, CommentId: number, user:User): Promise<boolean> {
    const deleteResult: DeleteResult =
      await this.CommentRepository.delete(CommentId);
    return deleteResult.affected > 0;
  }
}
