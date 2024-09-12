import {
  Controller,
  UploadedFile,
  Req,
  Put,
  Res,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  HttpStatus,
} from '@nestjs/common';
import { PostService } from './post.service';
import { Response, Request } from 'express';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { JwtAuthGuard } from '../Guard/jwt.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { User } from '../user/entities/user.entities';
import { Posts } from './entities/post.entities';
import { IpostController } from './interface/IpostController';

@Controller(
  'categories/:categoryId/subCategories/:subCategoryId/subSubCategories/:subSubCategoryId/favorite/:FavoriteId/posts'
)
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Posts> {
    const user = req.user as User;
    const imageUrl = file ? file.filename : null;
    return await this.postService.createPostService(
      createPostDto,
      +FavoriteId,
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      user,
      imageUrl,
    );
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  async findAllPosts(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return await this.postService.findAllPostService(
      +FavoriteId,
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      user,
    );
  }

  @Get(':postId')
  async findOnePost(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Param('postId') postId: string,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    return this.postService.findOnePostService(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      +FavoriteId,
      +postId,
      user,
    );
  }

  @Put(':postId')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updatePost(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Param('postId') postId: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Posts> {
    const user = req.user as User;
    const imageUrl = file ? file.filename : null;
    return this.postService.updatePostService(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      +FavoriteId,
      +postId,
      user,
      updatePostDto,
      imageUrl,
    );
  }

  @Delete(':postId')
  @UseGuards(JwtAuthGuard)
  async removePost(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Param('postId') postId: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const user = req.user as User;
    await this.postService.removePostService(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      +FavoriteId,
      +postId,
      user,
    );
    res.status(HttpStatus.OK).json({ message: '삭제가 완료되었습니다' });
  }
  @Get('/best')
  async getBest(
    @Param('categoryId') categoryId: string,
    @Param('subCategoryId') subCategoryId: string,
    @Param('subSubCategoryId') subSubCategoryId: string,
    @Param('FavoriteId') FavoriteId: string,
    @Res() res: Response,
  ) {
    const data = this.postService.getPopularPost(
      +categoryId,
      +subCategoryId,
      +subSubCategoryId,
      +FavoriteId,
    );
    return res.status(HttpStatus.OK).json(data);
  }
}
