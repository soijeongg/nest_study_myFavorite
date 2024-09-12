import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFavoriteDto } from './dto/create-favorite.dto';
import { UpdateFavoriteDto } from './dto/update-favorite.dto';
import { Favorite } from './entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubSubCategoriesService } from 'src/sub-sub-categories/sub-sub-categories.service';
import { userType } from 'src/user/DTO';
import { userFavorite } from 'src/user/entities/userFavorite.entities';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private FavoriteRepository: Repository<Favorite>,
    @InjectRepository(userFavorite)
    private userFavoriteRepostiory: Repository<userFavorite>,
    private subSubCategoryService: SubSubCategoriesService,
    private userService: UserService,
  ) {}
  //TODO: 최애생성 카테고리, 서브카테고리, 서브카테고리,서브서브 카테고리 아이디를 받고 최애를 생성한다
  async createFavoriteService(
    createDto: CreateFavoriteDto,
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    status: string,
  ) {
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    const { name, description } = createDto;
    //서서브 카테고리 찾기
    const subCate = await this.subSubCategoryService.findOneSubSubCategory(
      categoryId,
      subCategoryId,
      subSubCategoryId,
    );
    if (!subCate) {
      throw new HttpException(
        '해당하는 카테고리가 존재하지 않습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //이름 중복되었는지 확인
    const checkName = await this.FavoriteRepository.findOne({
      where: { name },
    });
    if (checkName && checkName.deleteAt != null) {
      checkName.deleteAt = new Date();
      return await this.FavoriteRepository.save(checkName);
    }
    if (checkName) {
      throw new HttpException(
        '이미 해당 최애가 존재합니다',
        HttpStatus.BAD_REQUEST,
      );
      //이제 생성
    }
    const newFav = await this.FavoriteRepository.create({
      name,
      description,
      subSubCategory: subCate,
    });
    return await this.FavoriteRepository.save(newFav);
  }

  //TODO: 전체 최애를 반환(최애는 최애만)
  async getAllFavoriteService(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
  ) {
    const subCate = await this.subSubCategoryService.findOneSubSubCategory(
      categoryId,
      subCategoryId,
      subSubCategoryId,
    );
    if (!subCate) {
      throw new HttpException(
        '해당하는 카테고리가 존재하지 않습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //이 서브 카테고리를 사용해 검색
    const findFavs = await this.FavoriteRepository.find({
      where: { subSubCategory: subCate },
    });
    return {
      favorites: findFavs.map((findFav) => ({
        favoriteId: findFav.favoriteId,
        favoriteName: findFav.name,
        description: findFav.description,
      })),
    };
  }
  //히니 가져오기 
  async getOneFavorite(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
  ) {
    const subSubCategory = await this.subSubCategoryService.findOneSubSubCategory(
        categoryId,
        subCategoryId,
        subSubCategoryId,
      );
    if (!subSubCategory) {
      throw new HttpException(
        '해당하는 카테고리가 존재하지 않습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //이 서브 카테고리를 사용해 검색
    const fav = await this.FavoriteRepository.findOne({
      where: { favoriteId, deleteAt: null },
    });
    return fav;
  }

  async updateFavoriteService(
    favoriteId: number,
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    updateDto: UpdateFavoriteDto,
    status: string,
  ) {
    //아이디로 찾고 유저 맞는지 확인 그리고 하나씩 있으면 바꾸고 save
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    const { name, description } = updateDto;
    const subCate = await this.subSubCategoryService.findOneSubSubCategory(
      categoryId,
      subCategoryId,
      subSubCategoryId,
    );
    if (!subCate) {
      throw new HttpException(
        '해당하는 카테고리가 존재하지 않습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const fav = await this.FavoriteRepository.findOne({
      where: { favoriteId, subSubCategory: subCate },
    });
    if (!fav) {
      throw new HttpException(
        '존재하지 않는 최애 입니다',
        HttpStatus.NOT_FOUND,
      );
    }
    if (name) {
      fav.name = name;
    }
    if (description) {
      fav.description = description;
    }
    return await this.FavoriteRepository.save(fav);
  }

  async deleteFavoriteService(
    favoriteId: number,
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    status: string,
  ) {
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    const subCate = await this.subSubCategoryService.findOneSubSubCategory(
      categoryId,
      subCategoryId,
      subSubCategoryId,
    );
    if (!subCate) {
      throw new HttpException(
        '해당하는 카테고리가 존재하지 않습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const fav = await this.FavoriteRepository.findOne({
      where: { favoriteId, subSubCategory: subCate },
    });
    if (!fav) {
      throw new HttpException(
        '존재하지 않는 최애 입니다',
        HttpStatus.NOT_FOUND,
      );
    }
    if (fav.deleteAt != null) {
      throw new HttpException('이미 삭제된 최애입니다', HttpStatus.NOT_FOUND);
    }
    fav.deleteAt = new Date();
    return await this.FavoriteRepository.save(fav);
  }
  //최애를 선택하기
  async createUserFavorite(
    favoriteId: number,
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    userId: number,
  ) {
    const subCate = await this.subSubCategoryService.findOneSubSubCategory(
      categoryId,
      subCategoryId,
      subSubCategoryId,
    );
    if (!subCate) {
      throw new HttpException(
        '해당하는 카테고리가 존재하지 않습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const fav = await this.FavoriteRepository.findOne({
      where: { favoriteId, subSubCategory: subCate, deleteAt: null },
    });
    if (!fav) {
      throw new HttpException(
        '존재하지 않는 최애 입니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const user = await this.userService.findUserByID(userId);
    //favorite를 사용해 저장한다
    const newMyFav = await this.userFavoriteRepostiory.create({
      user: user,
      favorite: fav,
    });
    return await this.userFavoriteRepostiory.save(newMyFav);
  }
  //최에 삭제하기
  async removeMyFav(
    favoriteId: number,
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    userId: number,
  ) {
    const subCate = await this.subSubCategoryService.findOneSubSubCategory(
      categoryId,
      subCategoryId,
      subSubCategoryId,
    );
    if (!subCate) {
      throw new HttpException(
        '해당하는 카테고리가 존재하지 않습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const fav = await this.FavoriteRepository.findOne({
      where: { favoriteId, subSubCategory: subCate, deleteAt: null },
    });
    if (!fav) {
      throw new HttpException(
        '존재하지 않는 최애 입니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const user = await this.userService.findUserByID(userId);
    //이 유저와 favorite로 찾는다
    const findUSerFav = await this.userFavoriteRepostiory.findOne({
      where: {
        user: user,
        favorite: fav,
      },
    });
    if (!findUSerFav) {
      throw new HttpException(
        '존재하지 않는 최애 입니다',
        HttpStatus.NOT_FOUND,
      );
    }
    if (findUSerFav.deleteAt != null) {
      throw new HttpException('이미 삭제 되었습니다', HttpStatus.NOT_FOUND);
    }
    return await this.userFavoriteRepostiory.save(findUSerFav);
  }
  async getPopularFavorite(categoryId: number, subCategoryId: number, subSubCategoryId: number) {
    return this.FavoriteRepository.createQueryBuilder('favorite')
      .leftJoinAndSelect('favorite.subSubCategory', 'subSubCategory')
      .leftJoinAndSelect('subSubCategory.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.category', 'category')
      .leftJoinAndSelect('favorite.posts', 'post')
      .leftJoinAndSelect('post.likes', 'like')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('subCategory.id = :subCategoryId', { subCategoryId })
      .andWhere('subSubCategory.id = :subSubCategoryId', { subSubCategoryId })
      .orderBy('COUNT(like.id)', 'DESC')
      .groupBy('favorite.id')
      .limit(1)
      .getOne();
  }
}
