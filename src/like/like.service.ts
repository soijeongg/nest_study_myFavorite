import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { IlikeService } from './interface/ILikeService';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { PostService } from '../post/post.service';
import { User } from '../user/entities/user.entities';
import { Posts } from '../post/entities/post.entities';
import { UserService } from '../user/user.service';
import { CommentService } from 'src/comment/comment.service';
@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(Like) private LikeRepository: Repository<Like>,
    private postService: PostService,
    private commentService: CommentService

  ) {}
  //좋아요 생성
  async createLikeService(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
    postId: number,
    user: User,
  ): Promise<Like> {
    const post = await this.postService.findOnePostService(categoryId, subCategoryId, subSubCategoryId, favoriteId, postId, user)
    if (!post) {
      throw new HttpException(
        '해당하는 포스트가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }

    const newLike = await this.LikeRepository.create({
      post:{postId: postId},
      user,
    });
    return await this.LikeRepository.save(newLike);
  }

  //좋아요 삭제
  async deleteLikeService(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
    postId: number,
    user: User,
  ) {
    const post = await this.postService.findOnePostService(categoryId, subCategoryId, subSubCategoryId, favoriteId, postId, user)
    if (!post) {
      throw new HttpException(
        '해당하는 포스트가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const findlike = await this.LikeRepository.findOne({
      where: {
        post: { postId },
        user: user,
      },
    });
    if (!findlike) {
      throw new HttpException('삭제할 좋아요가 없습니다', HttpStatus.NOT_FOUND);
    }
    findlike.deleteAt = new Date();
    return await this.LikeRepository.save(findlike);
  }
  async createLikeCommentService(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
    postId: number,
    commentId: number,
    user: User,
  ): Promise<Like> {
    const comment = await this.commentService.findCommentService(categoryId, subCategoryId, subSubCategoryId, favoriteId, postId, commentId, user)
    if (!comment) {
      throw new HttpException('해당하는 댓글이 없습니다', HttpStatus.NOT_FOUND);
    }
    const findlike = await this.LikeRepository.findOne({
      where: {
        post: { postId },
        comment: { commentId },
        user,
      },
    });
    if (findlike) {
      throw new HttpException('이미 좋아요한 댓글 입니다', HttpStatus.NOT_FOUND);
    }
    const newLike = await this.LikeRepository.create({
      post: { postId },
      comment: { commentId },
      user,
    });
    return await this.LikeRepository.save(newLike);
  }

  //좋아요 삭제
  async deleteLikeCommentService(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
    postId: number,
    commentId: number,
    user: User,
  ) {
    const comment = await this.commentService.findCommentService(categoryId, subCategoryId, subSubCategoryId, favoriteId, postId, commentId, user)
    if (!comment) {
      throw new HttpException('해당하는 댓글이 없습니다', HttpStatus.NOT_FOUND);
    }
    const findlike = await this.LikeRepository.findOne({
      where: {
        post: { postId },
        comment: { commentId },
        user,
      },
    });
    if (findlike) {
      throw new HttpException('삭제할 좋아요가 없습니다', HttpStatus.NOT_FOUND);
    }
    findlike.deleteAt = new Date();
    return await this.LikeRepository.save(findlike);
  }
}
