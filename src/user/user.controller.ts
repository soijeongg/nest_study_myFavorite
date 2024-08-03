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
} from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDTO, loginDTO, updateUserDTO } from './DTO';
import { User } from './entities/user.entities';
import { Request, Response } from 'express';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { adminGuard } from 'src/Guard/adminGuard';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { IuserController } from './interface/IuserController';

@ApiTags('user')
@ApiResponse({ status: 200, description: '성공' })
@Controller('user')
export class UserController implements IuserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(adminGuard)
  async findAllController(): Promise<User[]> {
    return this.userService.getAllService();
  }

  @Post()
  async createUserController(@Body() createDto: createUserDTO): Promise<User> {
    return this.userService.createUserService(createDto);
  }

  @Post('/login')
  async loginController(
    @Body() LoginDTO: loginDTO,
    @Res() res: Response,
  ): Promise<void> {
    const accessToken = await this.userService.loginUserService(LoginDTO);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    res.status(HttpStatus.OK).json({ message: '로그인 성공', accessToken });
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUserController(
    @Body() updateDTO: updateUserDTO,
    @Res() res: Response,
  ): Promise<void> {
    await this.userService.updateUserService(updateDTO);
    res.status(HttpStatus.OK).json({ message: 'User updated successfully' });
  }

  @Delete()
  @UseGuards(JwtAuthGuard)
  async deleteUserController(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const user = req.user as User;
    await this.userService.deleteUserService(user.userId);
    res.status(HttpStatus.OK).json({ message: '삭제가 완료되었습니다' });
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async getuserIdController(
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<User> {
    const user = req.user as User;
    return this.userService.findUserByID(user.userId);
  }
  @Get('search')
  async searchUserController(username: string): Promise<User[] | User | null> {
    return this.userService.searchUserService(username);
  }
}
