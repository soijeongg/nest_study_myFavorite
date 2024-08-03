import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { UpdateFavoriteDto } from '../dto/update-favorite.dto';
import { Favorite } from '../entities/favorite.entity';
import { Request, Response } from 'express';

export interface IfavoriteController {
  createFavoriteController(
    file: Express.Multer.File,
    createDto: CreateFavoriteDto,
    req: Request,
  ): Promise<Favorite>;

  updateFavoriteController(
    favoriteId: string,
    updateDto: UpdateFavoriteDto,
    req: Request,
    file?: Express.Multer.File,
  );

  deleteFavoritecontroller(
    req: Request,
    favoriteId: string,
    res: Response,
  ): Promise<void>;

  getAllUSerFavoriteController();

  getAllFavoeiteController(req: Request): Promise<Favorite[]>;

  getOneFavoriteController(FavoriteId: string): Promise<Favorite>;

  searchFavoriteNameController(name: string): Promise<Favorite[]>;

  searchFavoriteCategoriesController(categories: string): Promise<Favorite[]>;

  //다른 유저의 전체 최애 보기
  getOtherUserFavoriteController(userld: string): Promise<Favorite[]>;
}
