import { Injectable } from '@nestjs/common';
import { CreateSubSubCategoryDto } from './dto/create-sub-sub-category.dto';
import { UpdateSubSubCategoryDto } from './dto/update-sub-sub-category.dto';

@Injectable()
export class SubSubCategoriesService {
  create(createSubSubCategoryDto: CreateSubSubCategoryDto) {
    return 'This action adds a new subSubCategory';
  }

  findAll() {
    return `This action returns all subSubCategories`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subSubCategory`;
  }

  update(id: number, updateSubSubCategoryDto: UpdateSubSubCategoryDto) {
    return `This action updates a #${id} subSubCategory`;
  }

  remove(id: number) {
    return `This action removes a #${id} subSubCategory`;
  }
}
