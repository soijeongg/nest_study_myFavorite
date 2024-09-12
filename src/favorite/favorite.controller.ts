import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseGuards,
  Req,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { Request, Response } from 'express';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { User } from '../user/entities/user.entities';
import { JwtAuthGuard } from '../Guard/jwt.guard';

@Controller(
  'categories/:categoryId/sub-categories/:subCategoryId/subSubCategory/:subCategoryId/favorite',
)
export class FavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async createFavoriteController(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Req() req: Request,
    @Body() createFavoriteDto: CreateFavoriteDto,
  ) {
    const user = req.user as User;
    const status = user.status;
    return await this.favoriteService.createFavoriteService(
      createFavoriteDto,
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      status,
    );
  }

  @Get()
  async getAllFavoeiteController(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
  ) {
    return await this.favoriteService.getAllFavoriteService(+categoryId, +subCategoryId, +subSubCategoryId)
  }

  @Put(':FavoriteId')
  @UseGuards(JwtAuthGuard)
  async updateFavoriteController(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const status = user.status;
    return await this.favoriteService.updateFavoriteService(+FavoriteId, +categoryId, +subCategoryId, +subSubCategoryId, updateFavoriteDto, status)
  }

  @Delete(':FavoriteId')
  @UseGuards(JwtAuthGuard)
  async deleteFavoritecontroller(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    const status = user.status;
    await this.favoriteService.deleteFavoriteService(+FavoriteId, +categoryId, +subCategoryId, +subSubCategoryId, status)
    res.status(HttpStatus.OK).json({ message: '삭제가 완료되었습니다' });
  }

  @Get(':favoriteId/createFavorite')
  @UseGuards(JwtAuthGuard)
  async createMyFavorite(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    const userId = user.userId;
    return await this.favoriteService.createUserFavorite(+FavoriteId, +categoryId, +subCategoryId, +subSubCategoryId, +userId)
  }

  @Delete(': favoriteId/removeFavorite')
  async removeMyFavorite(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    const userId = user.userId;
    await this.favoriteService.removeMyFav(
      +FavoriteId,
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      +userId,
    );
    res.status(HttpStatus.OK).json({message: '나의 최애에서 삭제되었습니다'})
  }

  @Get('/best')
  async getBest(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Res() res: Response,
  ) {
    const data = this.favoriteService.getPopularFavorite(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
    );
    return res.status(HttpStatus.OK).json(data);
  }
}
