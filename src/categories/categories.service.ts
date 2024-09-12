import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { userType } from 'src/user/DTO';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectRepository(Category)
    private categoriesRepostiory: Repository<Category>,
  ) {}

  //TODO: categories 생성 서비스 카테고리 이름이 들어오고 유저의 status가 admin인 경우만 생성
  async createCategories(createCategoryDto: CreateCategoryDto, status: string) {
    const { categoriesName } = createCategoryDto;
    //status가 admin인지 검사
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    //카테고리 닉네임이 중복되지 않았는지를 검사한다
    const checkCategoriesName = await this.categoriesRepostiory.findOne({
      where: { categoriesName },
    });
    //이미 있지만 삭제 된 경우 deleteAt만 다시 null로 바꾼다
    if (checkCategoriesName && checkCategoriesName.deleteAt !== null) {
      checkCategoriesName.deleteAt = null;
      return await this.categoriesRepostiory.save(checkCategoriesName);
    }
    //delteAt이  null 이면 지금 중복
    if (checkCategoriesName) {
      throw new HttpException('헤딩 카테고리가 이미 존재합니다 ', HttpStatus.BAD_REQUEST)
    }
    const newCategories = await this.categoriesRepostiory.create({
      categoriesName,
    });
    return await this.categoriesRepostiory.save(newCategories);
  }
  //TODO:  카테고리 전체를 조회 해당 카테고리와 해당 카테고리에 딸린 서브 카테고리만 조회된다
  async findAllCategories() {
    const allCategories = await this.categoriesRepostiory.find({
      where:{deleteAt: null}
    });
    return {
      categories: allCategories.map((category) => ({
        categoryId: category.categoriesId,
        categoryName: category.categoriesName,
        subCategories: category.subCategories.map((subCategory) => ({
          subCategoryId: subCategory.subcategoriesId,
          subCategoryName: subCategory.subCategoryName,
        })),
      })),
    };
  }
  //TODO:  카테고리 전체를 조회 해당 카테고리 하나와와 해당 카테고리에 딸린 서브 카테고리만 조회된다
  async findOneCategory(categoriesId: number) {
    const findOne = await this.categoriesRepostiory.findOne({
      where: { categoriesId, deleteAt: null },
      relations: ['subCategories'],
    });
    if (!findOne) {
      throw new HttpException('존재하지 않는 카테고리 입니다', HttpStatus.NOT_FOUND)
    }
    return {
      categoryId: findOne.categoriesId,
      categoryName: findOne.categoriesName,
      subCategories: findOne.subCategories.map((subCategory) => ({
        subCategoryId: subCategory.subcategoriesId,
        subCategoryName: subCategory.subCategoryName,
      })),
    };
  }

  //카테고리 수정, 카테고리 아이디와 카테고리 이름이 들어온다 카테고리 아이디 검사하고 카테고리 닉네임이 있는지 검사한다
  async updateCategories(categoriesId: number, updateCategoryDto: UpdateCategoryDto, status: string) {
    const { categoriesName } = updateCategoryDto;
    //status가 admin인지 검사
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    const findOne = await this.categoriesRepostiory.findOne({
      where: { categoriesId },
    });
    if (findOne.deleteAt != null || !findOne) {
      throw new HttpException('존재하지 않는 카테고리 입니다', HttpStatus.NOT_FOUND)
    }
    //카테고리 닉네임이 중복되지 않았는지를 검사한다
    const checkCategoriesName = await this.categoriesRepostiory.findOne({
      where: { categoriesName },
    });
    if (checkCategoriesName.deleteAt == null) {
      throw new HttpException('이미 존재하는 카테고리입니다', HttpStatus.BAD_REQUEST)
    }
    const categoies = await this.categoriesRepostiory.findOne({
      where: { categoriesId },
    });
    categoies.categoriesName = categoriesName;
    return await this.categoriesRepostiory.save(categoies);
  }

  async removeCategories(categoriesId: number, status: string) {
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    const findOne = await this.categoriesRepostiory.findOne({
      where: { categoriesId, deleteAt: null },
    });
    if (!findOne) {
      throw new HttpException('존재하지 않는 카테고리 입니다', HttpStatus.NOT_FOUND)
    }
    const categoies = await this.categoriesRepostiory.findOne({
      where: { categoriesId, deleteAt: null },
    });
    categoies.deleteAt = new Date();
    return await this.categoriesRepostiory.save(categoies);
  }
}
