import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards, Req, HttpStatus, Res } from '@nestjs/common';
import { SubSubCategoriesService } from './sub-sub-categories.service';
import { CreateSubSubCategoryDto } from './dto/create-sub-sub-category.dto';
import { UpdateSubSubCategoryDto } from './dto/update-sub-sub-category.dto';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';
import { Request, Response } from 'express';
import { User } from 'src/user/entities/user.entities';

@Controller(
  'categories/:categoryId/subCategories/:subCategoryId/subSubCategories',
)
export class SubSubCategoriesController {
  constructor(
    private readonly subSubCategoriesService: SubSubCategoriesService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Body() createSubSubCategoryDto: CreateSubSubCategoryDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const status = user.status;
    return await this.subSubCategoriesService.create(
      createSubSubCategoryDto,
      +categoryId,
      +subCategoryId,
      status,
    );
  }

  @Get()
  async findAll(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
  ) {
    return await this.subSubCategoriesService.findAll(
      +categoryId,
      +subCategoryId,
    );
  }

  @Get(':subSubCategoryId')
  async findOne(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
  ) {
    return await this.subSubCategoriesService.findOne(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
    );
  }

  @Put(':subSubCategoryId')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Body() updateSubSubCategoryDto: UpdateSubSubCategoryDto,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const status = user.status;
    return await this.subSubCategoriesService.update(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      updateSubSubCategoryDto,
      status,
    );
  }

  @Delete(':subSubCategoryId')
  @UseGuards(JwtAuthGuard)
  async remove(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const user = req.user as User;
    const status = user.status;
    await this.subSubCategoriesService.remove(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      status,
    );
    res.status(HttpStatus.OK).json({ message: '정상적으로 삭제되었습니다' });
  }
}
