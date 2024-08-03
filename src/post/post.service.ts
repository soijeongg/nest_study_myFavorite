import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IpostService } from './interface/IpostService';
import { Posts } from './entities/post.entities';
import { Favorite } from 'src/favorite/entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, DeleteResult } from 'typeorm';
import { User } from 'src/user/entities/user.entities';
@Injectable()
export class PostService implements IpostService {
  constructor(
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
    @InjectRepository(Favorite)
    private favoriteRepostiory: Repository<Favorite>,
  ) {}
  async createPostService(
    createPostDto: CreatePostDto,
    imageUrl: string,
    user: User,
  ): Promise<Posts> {
    const { title, description, favoriteId } = createPostDto;
    const favorite = await this.favoriteRepostiory.findOne({
      where: { favoriteId: favoriteId },
    });
    if (!favorite) {
      throw new HttpException(
        '먼저 최애를 등록하고 작성해주세요',
        HttpStatus.NOT_FOUND,
      );
    }
    const newPost = this.postRepository.create({
      title,
      description,
      imageUrl,
      favorite,
      user,
    });
    return await this.postRepository.save(newPost);
  }

  async findAllPostService(): Promise<Posts[]> {
    return await this.postRepository.find();
  }

  async findOnePostService(postId: number): Promise<Posts> {
    return await this.postRepository.findOne({
      where: { PostsId: postId },
    });
  }

  async updatePostService(
    id: number,
    updatePostDto: UpdatePostDto,
    imageUrl: string | null,
  ) {
    const post = await this.postRepository.findOne({
      where: { PostsId: id },
    });
    if (!post) {
      throw new HttpException(
        '해당하는 포스트가 없습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (updatePostDto.description) {
      post.description = updatePostDto.description;
    }
    if (updatePostDto.favoriteId) {
      const favorite = await this.favoriteRepostiory.findOne({
        where: { favoriteId: updatePostDto.favoriteId },
      });
      if (!favorite) {
        throw new HttpException(
          '먼저 최애를 등록하고 작성해주세요',
          HttpStatus.NOT_FOUND,
        );
      }
      post.favorite = favorite;
    }
    if (updatePostDto.title) {
      post.title = updatePostDto.title;
    }
    if (imageUrl) {
      post.imageUrl = imageUrl;
    }
    return await this.postRepository.save(post);
  }

  async removePostService(id: number): Promise<boolean> {
    const deleteResult: DeleteResult = await this.postRepository.delete(id);
    return deleteResult.affected > 0;
  }
  async searchPostService(searchTerm: string): Promise<Posts[]> {
    return this.postRepository.find({
      where: [
        { title: Like(`%${searchTerm}%`) },
        { description: Like(`%${searchTerm}%`) },
        { comments: Like(`%${searchTerm}%`) },
      ],
    });
  }
}
