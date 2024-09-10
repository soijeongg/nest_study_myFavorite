import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SubSubCategoriesService } from './sub-sub-categories.service';
import { CreateSubSubCategoryDto } from './dto/create-sub-sub-category.dto';
import { UpdateSubSubCategoryDto } from './dto/update-sub-sub-category.dto';

@Controller('sub-sub-categories')
export class SubSubCategoriesController {
  constructor(private readonly subSubCategoriesService: SubSubCategoriesService) {}

  @Post()
  create(@Body() createSubSubCategoryDto: CreateSubSubCategoryDto) {
    return this.subSubCategoriesService.create(createSubSubCategoryDto);
  }

  @Get()
  findAll() {
    return this.subSubCategoriesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.subSubCategoriesService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSubSubCategoryDto: UpdateSubSubCategoryDto) {
    return this.subSubCategoriesService.update(+id, updateSubSubCategoryDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.subSubCategoriesService.remove(+id);
  }
}
