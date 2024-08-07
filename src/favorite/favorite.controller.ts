import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { IfavoriteController } from './interface/IfavoriteController';
import { multerOptions } from 'src/multer-opotions';
import { Favorite } from './entities/favorite.entity';
import { User } from '../user/entities/user.entities';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';

@Controller('favorite')
export class FavoriteController implements IfavoriteController {
  constructor(private readonly favoriteService: FavoriteService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file', multerOptions()))
  async createFavoriteController(
    @UploadedFile() file: Express.Multer.File,
    @Body() createFavoriteDto: CreateFavoriteDto,
    @Req() req: Request,
  ): Promise<Favorite> {
    const user = req.user as User;
    return this.favoriteService.createFavoriteService(
      file.filename,
      createFavoriteDto,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getAllFavoeiteController(@Req() req: Request): Promise<Favorite[]> {
    const user = req.user as User;
    return await this.favoriteService.getAllFavoriteService(user);
  }

  @Get()
  async getAllUSerFavoriteController() {
    return await this.favoriteService.getAllUserFavoriteService();
  }
  //애는 그냥 아이디 받고
  @Get(':FavoriteId')
  async getOneFavoriteController(
    @Param('FavoriteId') FavoriteId: string,
  ): Promise<Favorite> {
    return await this.favoriteService.getFavoriteOneService(+FavoriteId);
  }
  //다른 사람들꺼보기
  @Get('other/:userld')
  async getOtherUserFavoriteController(
    @Param('userld') userld: string,
  ): Promise<Favorite[]> {
    return await this.getOtherUserFavoriteController(userld);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':FavoriteId')
  @UseInterceptors(FileInterceptor('file', multerOptions()))
  async updateFavoriteController(
    @Param('FavoriteId') FavoriteId: string,
    @Body() updateFavoriteDto: UpdateFavoriteDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const imageUrl = file ? file.filename : null;
    const user = req.user as User;
    return await this.favoriteService.updateFavoriteService(
      +FavoriteId,
      updateFavoriteDto,
      user,
      imageUrl,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':FavoriteId')
  async deleteFavoritecontroller(
    @Req() req: Request,
    @Param('FavoriteId') FavoriteId: string,
    @Res() res: Response,
  ): Promise<void> {
    const user = req.user as User;
    await this.favoriteService.deleteFavoriteService(+FavoriteId, user);
    res.status(HttpStatus.OK).json({ message: '삭제가 완료되었습니다' });
  }

  @Get('search')
  async searchFavoriteCategoriesController(
    @Query('categories') categories: string,
  ): Promise<Favorite[]> {
    return await this.favoriteService.searchCategoriesService(categories);
  }

  @Get('serach')
  async searchFavoriteNameController(
    @Query('name') name: string,
  ): Promise<Favorite[]> {
    return await this.favoriteService.searchFavoriteService(name);
  }

  @Get('serach')
  async serachAllFavoriteController(
    @Body() searchTerm: string,
  ): Promise<Favorite[]> {
    return await this.serachAllFavoriteController(searchTerm);
  }
}
