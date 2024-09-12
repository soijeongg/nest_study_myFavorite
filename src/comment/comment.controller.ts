import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req,Res, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { User } from '../user/entities/user.entities';
import { Response, Request } from 'express';
import { Comment } from './entities/comment.entity';
@Controller('categories/:categoryId/subCategories/:subCategoryId/subSubCategories/:subSubCategoryId/favorite/:favoriteId/posts/:postId/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createComment(
    @Body() createDto: CreateCommentDto,
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Param('postId') postId: string,
    @Req() req: Request,
  ): Promise<Comment> {
    const user = req.user as User;
    return await this.commentService.createCommentService(+categoryId, +subCategoryId,+subSubCategoryId, +FavoriteId, +postId, createDto, user);
  }
  /* 덧글 전체는 포스트에 붙여나오고 덧글 하나만 보는 경우는 없음
  @Get(':postId')
  findAll() {
    return this.commentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.commentService.findOne(+id);
  }
  */
  @UseGuards(JwtAuthGuard)
  @Put(':commentId')
  async updateComment(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ): Promise<Comment> {
    const user = req.user as User;
    return this.commentService.updateCommentService(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      +FavoriteId,
      +postId,
      +commentId,
      updateCommentDto,
      user,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':postId/comments/:commentId')
  async removeComment(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const user = req.user as User;
    await this.commentService.removeComment(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      +FavoriteId,
      +postId,
      +commentId,
      user,
    );
    res.status(HttpStatus.OK).json({ message: '삭제가 완료되었습니다' });
  }
}
