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

@Controller('post')
export class PostController implements IpostController {
  constructor(private readonly postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createPost(
    @UploadedFile() file: Express.Multer.File,
    @Body() createPostDto: CreatePostDto,
    @Req() req: Request,
  ): Promise<Posts> {
    const user = req.user as User;
    return this.postService.createPostService(
      createPostDto,
      file.filename,
      user,
    );
  }

  @Get()
  async findAllPosts(): Promise<Posts[]> {
    return this.postService.findAllPostService();
  }

  @Get(':id')
  async findOnePost(@Param('id') id: string) {
    return this.postService.findOnePostService(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  @UseInterceptors(FileInterceptor('file'))
  async updatePost(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @Req() req: Request,
    @UploadedFile() file?: Express.Multer.File,
  ): Promise<Posts> {
    const user = req.user as User;
    const imageUrl = file ? file.filename : null;
    return this.postService.updatePostService(
      +id,
      updatePostDto,
      imageUrl,
      user,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async removePost(
    @Param('id') id: string,
    @Res() res: Response,
    @Req() req: Request,
  ): Promise<void> {
    const user = req.user as User;
    await this.postService.removePostService(+id, user);
    res.status(HttpStatus.OK).json({ message: '삭제가 완료되었습니다' });
  }

  @Get()
  async searchpost(@Body() searchTerm: string): Promise<Posts[] | Posts> {
    return await this.postService.searchPostService(searchTerm);
  }
}
