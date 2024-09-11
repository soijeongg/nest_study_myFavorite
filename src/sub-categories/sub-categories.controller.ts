import { Controller, Get, Post, Body, Patch, Param, Delete, Req, Put, UseGuards, Res, HttpStatus} from '@nestjs/common';
import { Request, Response } from 'express';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';
import { SubCategoriesService } from './sub-categories.service';
import { CreateSubCategoryDto } from './dto/create-sub-category.dto';
import { UpdateSubCategoryDto } from './dto/update-sub-category.dto';
import { User } from 'src/user/entities/user.entities';

@Controller('categories/:categoryId/sub-categories')
export class SubCategoriesController {
  constructor(private readonly subCategoriesService: SubCategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('categoryId') categoryId: string,
    @Body() createSubCategoryDto: CreateSubCategoryDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const status = user.status;
    return await this.subCategoriesService.createSubcategory(
      createSubCategoryDto,
      +categoryId,
      status,
    );
  }

  @Get()
  async findAll(@Param('categoryId') categoryId: string) {
    return await this.subCategoriesService.findAll(+categoryId);
  }

  @Get(':subCategoryId')
  async findOne(@Param('categoryId') categoryId: string, @Param('subCategoryId') subCategoryId: string) {
    return await this.subCategoriesService.findOne(+categoryId, +subCategoryId);
  }

  @Put(':subCategoryId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const status = user.status;
    return await this.subCategoriesService.updateSubCategory(+subCategoryId, updateSubCategoryDto, +categoryId, status)
  }

  @Delete(':subCategoryId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Body() updateSubCategoryDto: UpdateSubCategoryDto,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    const status = user.status;
    await this.subCategoriesService.removeSubCategory(+subCategoryId, +categoryId,status)
    res.status(HttpStatus.OK).json({ message: '성공적으로 삭제되었습니다' });
  }
}
