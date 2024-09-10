import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Put,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FriendService } from './friend.service';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { IfriendController } from './interface/IfriendController';
import { Request, Response } from 'express';
import { Friend } from './entities/friendRequests.entity';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { User } from '../user/entities/user.entities';

@Controller('friend')
export class FriendController implements IfriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createFriendController(
    @Body() createDto: CreateFriendDto,
    @Req() req: Request,
  ): Promise<Friend> {
    const user = req.user as User;
    return await this.friendService.createFriendService(createDto, user);
  }

  @Get(':username')
  async getAllFriendController(
    @Body('username') username: string,
  ): Promise<Friend[]> {
    return await this.friendService.getAllFriendService(username);
  }

  @UseGuards(JwtAuthGuard)
  @Put()
  async updateFriendController(
    updateDto: UpdateFriendDto,
    req: Request,
  ): Promise<Friend> {
    const user = req.user as User;
    return await this.friendService.updateFriendService(updateDto, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':username')
  async deleteFriendController(
    @Param('username') username: string,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const user = req.user as User;
    const result = await this.friendService.deleteFriendService(user, username);
    if (result) {
      res.status(HttpStatus.OK).json({ message: '삭제가 완료되었습니다' });
    } else {
      res
        .status(HttpStatus.NOT_FOUND)
        .json({ message: '친구 관계를 찾을 수 없습니다' });
    }
  }

  @Get(':username/search')
  async searchFriendController(
    @Body() searchTerm: string,
    @Param('username') username: string,
  ): Promise<Friend[]> {
    return await this.friendService.searchFriendService(searchTerm, username);
  }
}
