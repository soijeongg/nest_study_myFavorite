import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { ICommentService } from './interface/ICommentSercvice';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { User } from '../user/entities/user.entities';
import { PostService } from '../post/post.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment) private CommentRepository: Repository<Comment>,
    private postService: PostService,
  ) {}
  //댓글 생성
  async createCommentService(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
    postId: number,
    createCommentDto: CreateCommentDto,
    user: User,
  ): Promise<Comment> {
    //먼저 포스트 아이디로 포스트를 찾는다
    const post = await this.postService.findOnePostService(+categoryId, +subCategoryId, +subSubCategoryId, +favoriteId, +postId, user)
    const { content, anonymous } = createCommentDto;
    if (!post) {
      throw new HttpException(
        '해당하는 포스트가 없습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    const comment = this.CommentRepository.create({
      content,
      user,
      post:{postId: post.postId},
      ...(anonymous && { anonymous }),
    });
    return await this.CommentRepository.save(comment);
  }

  async updateCommentService(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
    postId: number,
    commentId: number,
    updateCommentDto: UpdateCommentDto,
    user: User,
  ): Promise<Comment> {
    //포스트를 검사하고 그 후 있다면 유저가 같은지 확인한다
    const post = await this.postService.findOnePostService(+categoryId, +subCategoryId, +subSubCategoryId, +favoriteId, +postId, user);
    const { content } = updateCommentDto;
    if (!post) {
      throw new HttpException(
        '해당하는 포스트가 없습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    //코멘트를 검사한다
    const comment = await this.CommentRepository.findOne({
      where: { commentId, post:{postId}, deleteAt: null},
    });
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

  async removeComment(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
    postId: number,
    commentId: number,
    user: User,
  ) {
    const post = await this.postService.findOnePostService(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      +favoriteId,
      +postId,
      user,
    );
    if (!post) {
      throw new HttpException(
        '존재하지 않는 포스트 입니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const comment = await this.CommentRepository.findOne({
      where: { commentId, post: { postId }, deleteAt: null },
    });

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
    comment.deleteAt = new Date();
    return  await this.CommentRepository.save(comment);
  }

  async findCommentService(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
    postId: number,
    commentId: number,
    user: User,
  ): Promise<Comment> {
    //포스트를 검사하고 그 후 있다면 유저가 같은지 확인한다
    const post = await this.postService.findOnePostService(+categoryId, +subCategoryId, +subSubCategoryId, +favoriteId, +postId, user);
    if (!post) {
      throw new HttpException(
        '해당하는 포스트가 없습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    //코멘트를 검사한다
    const comment = await this.CommentRepository.findOne({
      where: { commentId, post:{postId}, deleteAt: null},
    });
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
    return comment;
  }
}
