import { Controller, Body, Param, Get, Post, Put, Delete, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { createUserDTO, loginDTO,updateUserDTO } from './DTO';
import { User } from './entities/user.entities';
import { Response } from 'express';

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
  async loginController(@Body() loginDTO: loginDTO, res: Response) {
    const accessToken = await this.userService.loginUserService(loginDTO);
    res.setHeader('Authorization', `Bearer ${accessToken}`);
    return res
      .status(HttpStatus.OK)
      .json({ message: '로그인 성공', accessToken });
  }

  @Put('/:id')
  async updateUserController(
    @Param() id: number,
    @Body() updateDTO: updateUserDTO,
  ) {
    return 'updateUSer';
  }
}
