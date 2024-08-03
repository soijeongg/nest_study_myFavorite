import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req,Res, HttpStatus } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';
import { User } from 'src/user/entities/user.entities';
import { Response, Request } from 'express';
import { ICommentController } from './interface/ICommentController';
import { Comment } from './entities/comment.entity';
@Controller('comment')
export class CommentController implements ICommentController {
  constructor(private readonly commentService: CommentService) {}

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  async createComment(
    @Body() createDto: CreateCommentDto,
    @Param('postId') postId: string,
    @Req() req: Request,
  ): Promise<Comment> {
    const user = req.user as User;
    return await this.commentService.createCommentService(
      createDto,
      user,
      +postId,
    );
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
  @Put(':postId/comments/:commentId')
  async updateComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Body() updateCommentDto: UpdateCommentDto,
    @Req() req: Request,
  ): Promise<Comment> {
    const user = req.user as User;
    return this.commentService.updateCommentService(
      +postId,
      +commentId,
      updateCommentDto,
      user,
    );
  }
  @UseGuards(JwtAuthGuard)
  @Delete(':postId/comments/:commentId')
  async emoveComment(
    @Param('postId') postId: string,
    @Param('commentId') commentId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const user = req.user as User;
    await this.commentService.removeComment(+postId, +commentId, user);
    res.status(HttpStatus.OK).json({ message: '삭제가 완료되었습니다' });
  }
}
