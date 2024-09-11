import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Put, Res, HttpStatus } from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { Request, Response } from 'express';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from 'src/Guard/jwt.guard';
import { User } from 'src/user/entities/user.entities';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createCategoryDto: CreateCategoryDto, @Req() req: Request) {
    const user = req.user as User;
    const status = user.status;
    return this.categoriesService.createCategories(createCategoryDto, status);
  }

  @Get()
  findAll() {
    return this.categoriesService.findAllCategories();
  }

  @Get(':categoriesId')
  findOne(@Param('categoriesId') categoriesId: string) {
    return this.categoriesService.findOneCategory(+categoriesId);
  }

  @Put(':categoriesId')
  @UseGuards(JwtAuthGuard)
  update(@Param('categoriesId') categoriesId: string, @Body() updateCategoryDto: UpdateCategoryDto, @Req() req: Request) {
    const user = req.user as User;
    const status = user.status;
    return this.categoriesService.updateCategories(+categoriesId, updateCategoryDto, status);
  }

  @Delete(':categoriesId')
  async remove(@Param('categoriesId') categoriesId: string, @Req() req: Request, @Res() res: Response) {
    const user = req.user as User;
    const status = user.status;
    await this.categoriesService.removeCategories(+categoriesId, status);
    res.status(HttpStatus.OK).json({ message: '정상적으로 삭제되었습니다' });
  }
}
