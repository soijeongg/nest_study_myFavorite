import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { Repository } from 'typeorm';
import { CategoriesService } from 'src/categories/categories.service';
import { userType } from 'src/user/DTO';

@Injectable()
export class SubCategoriesService {
  constructor(
    @InjectRepository(SubCategory)
    private subCategoriesRepostiory: Repository<SubCategory>,
    private categoriesService: CategoriesService,
  ) {}
  //TODO: 파람으로 카테고리 아이디받고 dto로 서브 카테고리 이름 받아 생성, 이미있거나 deleteAt인지 확인
  async createSubcategory(
    createSubCategoryDto: CreateSubCategoryDto,
    categoryId: number,
    status: string,
  ) {
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    const { subCategoryName } = createSubCategoryDto;
    const category = await this.categoriesService.findOneCategory(categoryId);
    if (!category) {
      throw new HttpException(
        '존재하지 않는 카테고리 입니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //카테고리 이름이 있는지 확인한다
    const findSubCategory = await this.subCategoriesRepostiory.findOne({
        where:{subCategoryName: subCategoryName, Category: { categoriesId: categoryId }}
    });
    if(findSubCategory  && findSubCategory.deleteAt != null) {
      findSubCategory.deleteAt = null;
    return await this.subCategoriesRepostiory.save(findSubCategory)
    }
    if (findSubCategory) {
      throw new HttpException(
        '이미 존재하는 서브 카테고리 입니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newSubCagtegory = await this.subCategoriesRepostiory.create({
      subCategoryName: subCategoryName,
      Category: { categoriesId: categoryId },
    });
    return await this.subCategoriesRepostiory.save(newSubCagtegory);
  }
  //TODO: 해당 서브 카테고리 전채 반환시 서서브 카테고리도 같이 반환. 카테고리아이디가 들어오면 그걸로 검색한다
  async findAll(categoryId: number) {
    const findAllSubCategories = await this.subCategoriesRepostiory.find({
      where: { Category: { categoriesId: categoryId }, deleteAt: null },
    });
    return {
      subCategories: findAllSubCategories.map((subCategory) => ({
        subCategoriesId: subCategory.subcategoriesId,
        subCategoryName: subCategory.subCategoryName,
        createAt: subCategory.createAt,
        SubSubCategories: subCategory.subSubCategories.map((subSub) => ({
          subSubCategoryId: subSub.subSubCategoryId,
          subSubCategoryName: subSub.subSubCategoryName,
        })),
      })),
    };
  }
  //TODO: 카테고리 아이디, 서브 카테고리 아이디 받아 확인하고 안에 소속되어 있는지 확인, 서브 카테고리에 딸린 서서브 카테고리 같이 반환
  async findOne(categoryId: number, subCategoryId: number) {
    //먼저 카테고리가 있는지 확인하고 그 안의 서브 카테고리가 있는지 확인한다
    const category = await this.categoriesService.findOneCategory(categoryId);
    if (!category) {
      throw new HttpException(
        '해당하는 카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const findSub = await this.subCategoriesRepostiory.findOne({
      where: {
        subcategoriesId: subCategoryId,
        deleteAt: null,
        Category: { categoriesId: categoryId },
      },
    });

    if (!findSub) {
      throw new HttpException(
        '해당하는 서브 카테고리가 존재하지 않습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    return {
      subCategoryId: findSub.subcategoriesId,
      subCategoryName: findSub.subCategoryName,
      createAt: findSub.createAt,
      subSubCategories: findSub.subSubCategories.map((subSub) => ({
        subsubCategoriesId: subSub.subSubCategoryId,
        subSubCategoriesName: subSub.subSubCategoryName,
        creatAt: subSub.createAt,
      })),
    };
  }

  //TODO: 카테고리 아이디, 서브 카테고리 아이디 받아 확인하고 안에 소속되어 있는지 확인, 서서브 카테고리 이름이 해당 카테고리 안에 있는지 확인 및 deleteAt 확인
  async updateSubCategory(
    subCategoryId: number,
    updateSubCategoryDto: UpdateSubCategoryDto,
    categoryId: number,
    status: string,
  ) {
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    const { subCategoryName } = updateSubCategoryDto;
    //먼저 카테고리 찾는다
    const category = await this.categoriesService.findOneCategory(categoryId);
    if (!category) {
      throw new HttpException(
        '해당하는 카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //서브 카테고리를 찾는다
    const findSub = await this.subCategoriesRepostiory.findOne({
      where: {
        subcategoriesId: subCategoryId,
        deleteAt: null,
        Category: { categoriesId: categoryId },
      },
    });

    if (!findSub) {
      throw new HttpException(
        '해당하는 서브 카테고리가 존재하지 않습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    findSub.subCategoryName = subCategoryName;
    return await this.subCategoriesRepostiory.save(findSub);
  }
  //TODO: 카테고리 아이디, 서브 카테고리 아이디 받아 확인하고 안에 소속되어 있는지 확인, 서서브 카테고리 이름이 해당 카테고리 안에 있는지 확인 및 deleteAt 확인
  async removeSubCategory(
    subCategoryId: number,
    categoryId: number,
    status: string,
  ) {
    if (status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    //먼저 카테고리 찾는다
    const category = await this.categoriesService.findOneCategory(categoryId);
    if (!category) {
      throw new HttpException(
        '해당하는 카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //서브 카테고리를 찾는다
    const findSub = await this.subCategoriesRepostiory.findOne({
      where: {
        subcategoriesId: subCategoryId,
        deleteAt: null,
        Category: { categoriesId: categoryId },
      },
    });

    if (!findSub) {
      throw new HttpException(
        '해당하는 서브 카테고리가 존재하지 않습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //deleteAt에 날짜 넣기(소프트 삭제)
    findSub.deleteAt = new Date();
    await this.subCategoriesRepostiory.save(findSub);
  }
  async findOneSubCategory(categoryId: number, subCategoryId: number) {
    const category = await this.categoriesService.findOneCategory(categoryId);
    if (!category) {
      throw new HttpException(
        '해당하는 카테고리가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //서브 카테고리를 찾는다
    return await this.subCategoriesRepostiory.findOne({
      where: {
        subcategoriesId: subCategoryId,
        deleteAt: null,
        Category: { categoriesId: categoryId },
      },
    });
  }
}
