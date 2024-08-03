import { User } from 'src/user/entities/user.entities';
import { CreateFavoriteDto } from '../dto/create-favorite.dto';
import { UpdateFavoriteDto } from '../dto/update-favorite.dto';
import { Favorite } from '../entities/favorite.entity';

export interface IfavoriteService {
  createFavoriteService(
    imgurl: string,
    createDto: CreateFavoriteDto,
    user: User,
  ): Promise<Favorite>;

  updateFavoriteService(
    favoriteId: number,
    updateDto: UpdateFavoriteDto,
    user: User,
    imageUrl: string,
  ): Promise<Favorite>;

  deleteFavoriteService(favoriteId: number, user: User): Promise<boolean>;

  getAllFavoriteService(user: User): Promise<Favorite[]>;

  getOtherFavoriteService(userId: number);

  getFavoriteOneService(favoriteId: number): Promise<Favorite>;

  searchFavoriteService(name: string): Promise<Favorite[]>;

  searchCategoriesService(categories: string): Promise<Favorite[]>;

  getAllUserFavoriteService(): Promise<Favorite[]>;
}
