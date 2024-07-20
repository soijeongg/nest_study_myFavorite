import { Controller, Body, Param, Get, Post, Put, Delete, HttpStatus, UseGuards,Res, Req } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDTO, loginDTO, updateUserDTO } from './DTO';
import { User } from './entities/user.entities';
import { Request, Response } from 'express';
import { JwtAuthGuard } from './Guard/jwt.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  @Get()
  async findAllController() {
    return this.userService.getAllService();
  }

  @Post()
  async createUserController(@Body() createDto: createUserDTO): Promise<User> {
    return this.userService.createUserService(createDto);
  }

  @Post('/login')
  async loginController(@Body() LoginDTO: loginDTO, @Res() res: Response) {
    const accessToken = await this.userService.loginUserService(LoginDTO);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    return res
      .status(HttpStatus.OK)
      .json({ message: '로그인 성공', accessToken });
  }

  @Put()
  @UseGuards(JwtAuthGuard)
  async updateUserController(
    @Body() updateDTO: updateUserDTO,
    @Req() req: Request,
  ) {
    const user = req.user;
    return user;
  }
}
