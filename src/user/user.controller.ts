import {
  Controller,
  Body,
  Get,
  Post,
  Put,
  Delete,
  HttpStatus,
  UseGuards,
  Res,
  Req,
  Param,
  UseInterceptors,
  UploadedFile,
  HttpException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDTO, loginDTO, updateUserDTO } from './DTO';
import { User } from './entities/user.entities';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { adminGuard } from '../Guard/adminGuard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IuserController } from './interface/IuserController';
import { FileInterceptor } from '@nestjs/platform-express';
import multer from 'multer';

@ApiTags('user')
@ApiResponse({ status: 200, description: '성공' })
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllController(
    @Req() req: Request
  ) {
    const user = req.user as User;
    return this.userService.getAllService(user);
  }

  @Post()
  @UseInterceptors(FileInterceptor('profilePic'))
  async createUserController(
    @Body() createDto: createUserDTO,
    @UploadedFile() profilePic?: Express.Multer.File,
  ): Promise<User> {
   const file = profilePic ? profilePic.filename : null;
    return this.userService.createUserService(createDto, file);
  }

  @Post('/login')
  async loginController(
    @Body() LoginDTO: loginDTO,
    @Res() res: Response,
  ): Promise<void> {
    const { access_token, refresh_token } =
      await this.userService.loginUserService(LoginDTO);
    res.setHeader('Authorization', `Bearer ${access_token}`);
    res.cookie('refresh_token', refresh_token, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.status(HttpStatus.OK).json({ message: '로그인 성공', access_token });
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profilePic'))
  async updateUserController(
    @Body() updateDTO: updateUserDTO,
    @Res() res: Response,
    @Req() req: Request,
    @UploadedFile() profilePic?: Express.Multer.File,
  ) {
    const user = req.user as User;
    const imageUrl = profilePic ? profilePic.filename : null;
    await this.userService.updateUserService(updateDTO, +user.userId, imageUrl);
    return res
      .status(HttpStatus.OK)
      .json({ message: '성공적으로 유저를 업데이트 했습니다' });
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUserController(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const user = req.user as User;
    await this.userService.deleteUserService(+user.userId);
    res.status(HttpStatus.OK).json({ message: '삭제가 완료되었습니다' });
  }

  @Get(':userId')
  async getOtherUserController(@Param('userId') userId: string) {
    return await this.userService.getOtherUserService(+userId);
  }

  @Get('/me')
  @UseGuards(JwtAuthGuard)
  async getMineController(@Req() req: Request) {
    const user = req.user as User;
    return await this.userService.findMe(+user.userId);
  }

  @Get('/logout')
  @UseGuards(JwtAuthGuard)
  async logoutController(@Req() req: Request, @Res() res: Response) {
    const token = await req.headers.authorization.split('')[1];
    const refreshToken = req.cookies['refresh_token'];
    if (!token || !refreshToken) {
      throw new HttpException(
        '토큰이 유효하지 않습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    await this.userService.logout(token);
    res.clearCookie('refreshToken');
    res.status(HttpStatus.OK).json({ message: '로그아웃되었습니다.' });
  }
}
