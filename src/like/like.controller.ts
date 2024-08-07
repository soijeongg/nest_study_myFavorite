import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, Res, HttpStatus} from '@nestjs/common';
import { LikeService } from './like.service';
import { ILikeController } from './interface/ILikeController';
import { Like } from './entities/like.entity';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';
import { Request, Response } from 'express';
import { User } from '../user/entities/user.entities';

@Controller('like')
export class LikeController implements ILikeController {
  constructor(private readonly likeService: LikeService) {}
  //생성, 삭제, 전체보기, 하나누르면 그 하나의 포스트만 보기

  @UseGuards(JwtAuthGuard)
  @Post(':postId')
  async createLikeController(
    @Param('postId') postId: string,
    @Req() req: Request,
  ): Promise<Like> {
    const user = req.user as User;
    return await this.likeService.createLikeService(+postId, user);
  }

  @Get(':username')
  async getOneLikeController(
    @Param('username') username: string,
  ): Promise<Like[]> {
    return await this.likeService.getOtherLikeService(username);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAllLikeController( @Req() req: Request,  @Res() res: Response): Promise<Like[]> {
    const user = req.user as User;
    return await this.likeService.getAllLikeService(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':postId')
  async deleteLikeController(
    postId: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const user = req.user as User;
    await this.likeService.deleteLikeService(+postId, user);
    res.status(HttpStatus.OK).json({ message: '삭제가 완료되었습니다' });
  }

  @Get(':username')
  async searchLikeController(
    searchTerm: string,
    @Param('username') username: string,
  ): Promise<Like[]> {
    return await this.likeService.searchLikeService(searchTerm, username);
  }
}
