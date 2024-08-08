import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { IfavoriteService } from './interface/IfavoriteService';
import { User } from '../user/entities/user.entities';
import { Favorite } from './entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Like, Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class FavoriteService implements IfavoriteService {
  private readonly logger = new Logger(FavoriteService.name);
  constructor(
    @InjectRepository(Favorite)
    private FavoriteRepository: Repository<Favorite>,
    private userService: UserService,
  ) {}

  async createFavoriteService(
    imageUrl: string,
    createDto: CreateFavoriteDto,
    user: User,
  ): Promise<Favorite> {
    try {
      const { name, description, categories } = createDto;
      const newFav = this.FavoriteRepository.create({
        name,
        description,
        categories,
        imageUrl,
        user,
      });
      return await this.FavoriteRepository.save(newFav);
    } catch (error) {
      this.logger.error('Error creating favorite', error.stack);
      throw error;
    }
  }

  async getAllFavoriteService(user: User): Promise<Favorite[]> {
    return await this.FavoriteRepository.find({
      where: { user },
    });
  }

  async getAllUserFavoriteService(): Promise<Favorite[]> {
    return await this.FavoriteRepository.find();
  }

  async getFavoriteOneService(favoriteId: number): Promise<Favorite> {
    return await this.FavoriteRepository.findOne({
      where: { favoriteId },
    });
  }

  async getOtherFavoriteService(userId: number) {
    const user = await this.userService.findUserByID(userId);
    return user.favorites;
  }

  async updateFavoriteService(
    favoriteId: number,
    updateDto: UpdateFavoriteDto,
    user: User,
    imageUrl: string,
  ): Promise<Favorite> {
    //아이디로 찾고 유저 맞는지 확인 그리고 하나씩 있으면 바꾸고 save
    const fav = await this.FavoriteRepository.findOne({
      where: { favoriteId },
    });
    if (!fav) {
      throw new HttpException('해당하는 최애가 없습니다', HttpStatus.NOT_FOUND);
    }
    if (fav.user != user) {
      throw new HttpException('자신의 최애가 아닙니다', HttpStatus.BAD_REQUEST);
    }
    if (updateDto.categories) {
      fav.categories = updateDto.categories;
    }
    if (updateDto.description) {
      fav.description = updateDto.description;
    }
    if (updateDto.name) {
      fav.name = updateDto.name;
    }
    if (imageUrl) {
      fav.imageUrl = imageUrl;
    }
    return await this.FavoriteRepository.save(fav);
  }

  async deleteFavoriteService(
    favoriteId: number,
    user: User,
  ): Promise<boolean> {
    const fav = await this.getFavoriteOneService(favoriteId);
    if (!fav) {
      throw new HttpException('해당하는 최애가 없습니다', HttpStatus.NOT_FOUND);
    }
    if (fav.user != user) {
      throw new HttpException(
        '내가 만든 최애만 삭제할 수 있습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    const deleteResult: DeleteResult =
      await this.FavoriteRepository.delete(favoriteId);
    return deleteResult.affected > 0;
  }

  async searchFavoriteService(name: string): Promise<Favorite[]> {
    return this.FavoriteRepository.find({
      where: [{ name: Like(`%${name}%`) }],
    });
  }
  async searchCategoriesService(categories: string): Promise<Favorite[]> {
    return this.FavoriteRepository.find({
      where: [{ categories: Like(`%${categories}%`) }],
    });
  }

  async seachAllFavoriteService(searchTerm: string) {
    return this.FavoriteRepository.find({
      where: [
        { categories: Like(`%${searchTerm}%`) },
        { name: Like(`%${searchTerm}%`) },
        { description: Like(`%${searchTerm}%`) },
      ],
    });
  }
}
