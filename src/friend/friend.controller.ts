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
import { Request, Response } from 'express';
import { FriendRequest } from './entities/friendRequests.entity';
import { Friend } from './entities/friend.entity';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { User } from '../user/entities/user.entities';
import { CreateFriendRequestDto } from './dto/createFriendRequest.dto';

@Controller('friend')
export class FriendController {
  constructor(private readonly friendService: FriendService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async createFriendController(
    @Body() createDto: CreateFriendRequestDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return await this.friendService.createFriendService(createDto, user);
  }

  @Get('friend/receive')
  @UseGuards(JwtAuthGuard)
  async getReciveRequestController(@Req() req: Request) {
    const user = req.user as User;
    return await this.friendService.getReceivedFriendRequests(user);
  }
  @Get('friend/sent')
  @UseGuards(JwtAuthGuard)
  async getSentRequestController(@Req() req: Request) {
    const user = req.user as User;
    return await this.friendService.getSentFriendRequests(user);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':/Request/friendRequestId')
  async acceptFriendController(
    @Param('friendRequestId') friendRequestId: string,
    updateDto: UpdateFriendDto,
    req: Request,
  ): Promise<Friend> {
    const user = req.user as User;
    return await this.friendService.acceptedFriendService(+friendRequestId, user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':/Request/friendRequestId')
  async deleteFriendRequestController(
    @Param('friendRequestId') friendRequestId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    await this.friendService.rejectedFriendRequestService(+friendRequestId, user);
    return res
      .status(HttpStatus.OK)
      .json({message:"정상적으로 삭제되었습니다"})
  }

  @Delete(':friendId')
  @UseGuards(JwtAuthGuard)
  async searchFriendController(
    @Param('friendId') friendId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    await this.friendService.deleteFriendService(+friendId, user);
    return res
      .status(HttpStatus.OK)
      .json({message:"정상적으로 삭제되었습니다"})
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findFriendController(@Req() req: Request) {
    const user = req.user as User;
    return await this.friendService.findFriendService(user);
  }
}
