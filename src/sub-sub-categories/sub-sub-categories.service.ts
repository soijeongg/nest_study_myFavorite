import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSubSubCategoryDto } from './dto/create-sub-sub-category.dto';
import { UpdateSubSubCategoryDto } from './dto/update-sub-sub-category.dto';
import { SubSubCategory } from './entities/sub-sub-category.entity';
import { SubCategoriesService } from 'src/sub-categories/sub-categories.service';
import { userType } from 'src/user/DTO';

@Injectable()
export class SubSubCategoriesService {
  constructor(
    @InjectRepository(SubSubCategory)
    private subSubCategoryRepository: Repository<SubSubCategory>,
    private subCategoriesService: SubCategoriesService,
  ) {}

  //TODO: 카테고리, 서브카테고리 검사하기
  async create(
    createSubSubCategoryDto: CreateSubSubCategoryDto,
    categoryId: number,
    subCategoryId: number,
    status: string,
  ) {
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    const { subSubCategoryName } = createSubSubCategoryDto;
    const SubCategory = await this.subCategoriesService.findOne(
      categoryId,
      subCategoryId,
    );
    if (!SubCategory) {
      throw new HttpException(
        '해당하는 서브카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //이름 검사하기
    const checkName = await this.subSubCategoryRepository.findOne({
      where: { subSubCategoryName },
    });
    //만약 있는데 삭제 되었다면 deleteAt을 null로 바꾸기 있는데 deleteAt이 null이라면 에러
    if (checkName.deleteAt != null) {
      checkName.deleteAt = null;
      return await this.subSubCategoryRepository.save(checkName);
    }
    if (checkName) {
      throw new HttpException(
        '이미 존재하는 서서브 카테고리 입니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    const subCategories = await this.subCategoriesService.findOneSubCategory(
      categoryId,
      subCategoryId,
    );
    const subSub = await this.subSubCategoryRepository.create({
      subSubCategoryName,
      subCategory: subCategories,
    });
    return await this.subSubCategoryRepository.save(subSub);
  }

  //TODO: 카테고리, 서브카테고리, 서서브 카테고리를 받아 서서브 카테고리와 최애 전체를 반환한다
  async findAll(categoryId: number, subCategoryId: number) {
    const subCategory = await this.subCategoriesService.findOneSubCategory(
      categoryId,
      subCategoryId,
    );
    if (!subCategory) {
      throw new HttpException(
        '해당하는 서브카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //있다면 이걸로 찾기
    const findSubSubs = await this.subSubCategoryRepository.find({
      where: { subCategory, deleteAt: null },
    });
    return {
      subSubCategories: findSubSubs.map((subSub) => ({
        subSubCategoryId: subSub.subSubCategoryId,
        subSubCategoryName: subSub.subSubCategoryName,
        favorites: subSub.favorites.map((subFav) => ({
          favoriteId: subFav.favoriteId,
          favriteName: subFav.name,
          createAt: subFav.createdAt,
        })),
      })),
    };
  }
  //TODO: 하나의 서서브 카테고리를 찾는다
  async findOne(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
  ) {
    //서브카테고리, 카테고리를 검사한다
    const subCategory = await this.subCategoriesService.findOneSubCategory(
      categoryId,
      subCategoryId,
    );
    if (!subCategory) {
      throw new HttpException(
        '해당하는 서브카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const findOneSub = await this.subSubCategoryRepository.findOne({
      where: {
        subSubCategoryId,
        subCategory,
        deleteAt: null,
      },
    });
    if (!findOneSub) {
      throw new HttpException(
        '해당하는 서서브 카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      subSubCategoryId: findOneSub.subSubCategoryId,
      subSubCategoryName: findOneSub.subSubCategoryName,
      favorites: findOneSub.favorites.map((subFav) => ({
        favoriteId: subFav.favoriteId,
        favriteName: subFav.name,
        createAt: subFav.createdAt,
      })),
    };
  }
  //TODO: 업데이트 한다  카테고리,서브카테고리, 서서브커테고리를 검사하고 이름을 검사한다
  async update(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    updateSubSubCategoryDto: UpdateSubSubCategoryDto,
    status: string,
  ) {
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    const { subSubCategoryName } = updateSubSubCategoryDto;
    const subCategory = await this.subCategoriesService.findOneSubCategory(
      categoryId,
      subCategoryId,
    );
    if (!subCategory) {
      throw new HttpException(
        '해당하는 서브카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const findOneSub = await this.subSubCategoryRepository.findOne({
      where: {
        subSubCategoryId,
        subCategory,
        deleteAt: null,
      },
    });
    if (!findOneSub) {
      throw new HttpException(
        '해당하는 서서브 카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //있다면 이름 바꾸기
    findOneSub.subSubCategoryName = subSubCategoryName;
    return await this.subSubCategoryRepository.save(findOneSub);
  }

  async remove(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    status: string,
  ) {
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    const subCategory = await this.subCategoriesService.findOneSubCategory(
      categoryId,
      subCategoryId,
    );
    if (!subCategory) {
      throw new HttpException(
        '해당하는 서브카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const findOneSub = await this.subSubCategoryRepository.findOne({
      where: {
        subSubCategoryId,
        subCategory,
        deleteAt: null,
      },
    });
    if (findOneSub.deleteAt != null) {
      throw new HttpException('이미 삭제 되었습니다', HttpStatus.BAD_REQUEST);
    }
    if (!findOneSub) {
      throw new HttpException(
        '해당하는 서서브 카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //deleteAt에 날짜 넣기
    findOneSub.deleteAt = new Date();
    return await this.subSubCategoryRepository.save(findOneSub);
  }

  async findOneSubSubCategory(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
  ) {
    const category = await this.subCategoriesService.findOneSubCategory(
      categoryId,
      subCategoryId,
    );
    if (!category) {
      throw new HttpException(
        '해당하는 카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //서브 카테고리를 찾는다
    return await this.subSubCategoryRepository.findOne({
      where: {
        subSubCategoryId: subSubCategoryId,
        deleteAt: null,
        subCategory: { subcategoriesId: subCategoryId },
      },
    });
  }
}
