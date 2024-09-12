import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, Res, HttpStatus} from '@nestjs/common';
import { LikeService } from './like.service';
import { ILikeController } from './interface/ILikeController';
import { Like } from './entities/like.entity';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entities';

@Controller(
  'categories/:categoryId/subCategories/:subCategoryId/subSubCategories/:subSubCategoryId/favorite/:FavoriteId/posts')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}
  //생성, 삭제,(포스트) 생성, 삭제9포스트)

  @UseGuards(JwtAuthGuard)
  @Get(':postId/like')
  async createLikePostController(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Param('postId') postId: string,
    @Req() req: Request,
  ): Promise<Like> {
    const user = req.user as User;
    return await this.likeService.createLikeService(+categoryId, +subCategoryId, +subSubCategoryId, +FavoriteId, +postId, user)
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId/like')
  async deleteLikeController(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Param('postId') postId: string,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return await this.likeService.deleteLikeService(+categoryId, +subCategoryId, +subSubCategoryId, +FavoriteId, +postId, user)
  }
  @UseGuards(JwtAuthGuard)
  @Get(':postId/comments/:commentId/like')
  async createLikeCommentController(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Req() req: Request,
  ): Promise<Like> {
    const user = req.user as User;
    return await this.likeService.createLikeCommentService(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      +FavoriteId,
      +postId,
      +commentId,
      user,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':postId/comments/:commentId/like')
  async deleteLikeCommentController(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return await this.likeService.deleteLikeCommentService(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      +FavoriteId,
      +postId,
      +commentId,
      user,
    );
  }
}
