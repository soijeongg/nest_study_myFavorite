import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { IpostService } from './interface/IpostService';
import { PostType, Posts } from './entities/post.entities';
import { Favorite } from '../favorite/entities/favorite.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Repository, DeleteResult, Not } from 'typeorm';
import { User, userType } from '../user/entities/user.entities';
import { FavoriteService } from 'src/favorite/favorite.service';
@Injectable()
export class PostService  {
  constructor(
    @InjectRepository(Posts) private postRepository: Repository<Posts>,
    private favoriteService: FavoriteService,
  ) {}
  //TODO: 포스트 생성, 카테고리 서브, 서서브, 최애 받고 확인
  async createPostService(
    createPostDto: CreatePostDto,
    favoriteId: number,
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    user: User,
    imageUrl: string | null,
  ): Promise<Posts> {
    const { title, description, anonymous, postType } = createPostDto;
    //먼저 확인
    const findFav = await this.favoriteService.getOneFavorite(categoryId, subCategoryId, subSubCategoryId, favoriteId)
    if (!findFav) {
      throw new HttpException(
        '존재하지 않는 최애 입니다',
        HttpStatus.NOT_FOUND,
      );
    }
    if(postType== PostType.notice && user.status !=userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    const newPost = this.postRepository.create({
      title,
      description,
      imageUrl: imageUrl ? imageUrl : null,
      anonymous,
      favorite: findFav,
      postType,
      user,
    });
    return await this.postRepository.save(newPost);
  }
//각 최애의 전체 포스트 반환 이때 자신의 것이면 익명 상관없이 전부 나와야 하고 자신의 것이 아닌건 아예 익명이면 null로 
  async findAllPostService(
    favoriteId: number,
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    user:User
  ) {
    const findFav = await this.favoriteService.getOneFavorite(categoryId, subCategoryId, subSubCategoryId, favoriteId)
    if (!findFav) {
      throw new HttpException(
        '존재하지 않는 최애 입니다',
        HttpStatus.NOT_FOUND,
      );
    }
    //1. 먼저 유저 타입이 관리자일경우 익명 상관없이 반환
    if(user.status ==userType.ADMIN){
      const findPosts = await this.postRepository.find({
        where:{favorite: findFav, deleteAt: null}
      });
      return {
        posts:findPosts.map((post)  =>({
          postId: post.postId,
          PostType: post.postType,
          postTitle: post.title,
          description: post.description,
          creatAt: post.createAt,
          user: post.user.username,
          comments: post.comments.map((comment) => ({
            commentId: comment.commentId,
            createAt: comment.createdAt,
            user: comment.user.username,
          })),
        })),
      };
    }
    //유저의 타입이 관리자가 아닐경우 자신의 글은 익명이 아니여야하고 다른 사람의 글은 익명이면 익명이여야한다
    const myPosts = await this.postRepository.find({
      where:{ user, deleteAt: null }, select:['title', 'user', 'postType', 'postId', ]
    });
    //익명인 경우
    const findAnonymousPosts = await this.postRepository.find({
      where: { anonymous: true, deleteAt: null, user:{ userId: Not(user.userId) },}, select:['title', 'user', 'postType', 'postId']
    });
    const nonAnonymousPosts = await this.postRepository.find({
      where: { anonymous: false, deleteAt: null, user:{ userId: Not(user.userId) },}, select:['title', 'user', 'postType', 'postId']
    });
    const allPosts = [...myPosts, ...findAnonymousPosts, ...nonAnonymousPosts];
    return {
      posts: allPosts.map((post) => ({
        postId: post.postId,
        postTitle: post.title,
        postType: post.postType,
        user: post.user = user? user: null,
      })),
    };
  }

  async findOnePostService(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
    postId: number,
    user: User,
  ) {
    const findFav = await this.favoriteService.getOneFavorite(
      categoryId,
      subCategoryId,
      subSubCategoryId,
      favoriteId,
    );
    
    if (!findFav) {
      throw new HttpException('존재하지 않는 최애입니다.', HttpStatus.NOT_FOUND);
    }
  
    // 공통 포스트 조회 로직
    const findPost = await this.postRepository.findOne({
      where: { favorite: findFav, deleteAt: null, postId },
      relations: ['comments', 'user'], // 관련된 유저와 댓글을 포함하여 가져옴
    });

    if (!findPost) {
      throw new HttpException('게시물을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    // 공통 댓글 처리 함수
      const comments = findPost.comments ? findPost.comments.map((comment) => ({
          commentId: comment.commentId,
          content: comment.content,
          anonymous: comment.anonymous,
          user: comment.anonymous ? '익명' : comment.user.username, // 익명 여부에 따른 유저 정보 처리
        }))
      : [];

    if (user.status === userType.ADMIN) {
      return {
        postId: findPost.postId,
        postTitle: findPost.title,
        description: findPost.description,
        postType: findPost.postType,
        user: findPost.user.username, // 관리자는 유저 이름을 항상 볼 수 있음
        comments: comments,
      };
    }

    const postUser = findPost.anonymous ? '익명' : findPost.user.username;
    const normalComments = comments.map((comment) => ({
      commentId: comment.commentId,
      content: comment.content,
      user: comment.anonymous ? '익명' : comment.user,
    }));
    return {
      postId: findPost.postId,
      postTitle: findPost.title,
      description: findPost.description,
      postType: findPost.postType,
      user: postUser,
      comments: normalComments,
    };
  }

  async updatePostService(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
    postId: number,
    user: User,
    updatePostDto: UpdatePostDto,
    imageUrl: string | null,
  ) {
    const post = await this.postRepository.findOne({
      where: { postId: postId, user: user, deleteAt: null },
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
    if (updatePostDto.title) {
      post.title = updatePostDto.title;
    }
    if (imageUrl) {
      post.imageUrl = imageUrl;
    }
    return await this.postRepository.save(post);
  }

  async removePostService(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
    postId: number,
    user: User,
  ) {
    const post = await this.postRepository.findOne({
      where: { postId: postId, user: user, deleteAt: null },
    });
    if (!post) {
      throw new HttpException(
        '해당하는 포스트가 없습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    post.deleteAt = new Date();
    return await this.postRepository.save(post);
  }

  async getALLPOST(
    categoryId: number,
    subCategoryId: number,
    subSubCategoryId: number,
    favoriteId: number,
  ) {
    const findFav = await this.favoriteService.getOneFavorite(
      categoryId,
      subCategoryId,
      subSubCategoryId,
      favoriteId,
    );
    return this.postRepository.find({
      where: { favorite: findFav },
    });
  }

  async getPopularPost(categoryId: number, subCategoryId: number, subSubCategoryId: number, favoriteId: number) {
    return this.postRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.favorite', 'favorite')
      .leftJoinAndSelect('favorite.subSubCategory', 'subSubCategory')
      .leftJoinAndSelect('subSubCategory.subCategory', 'subCategory')
      .leftJoinAndSelect('subCategory.category', 'category')
      .leftJoinAndSelect('post.likes', 'like')
      .where('category.id = :categoryId', { categoryId })
      .andWhere('subCategory.id = :subCategoryId', { subCategoryId })
      .andWhere('subSubCategory.id = :subSubCategoryId', { subSubCategoryId })
      .andWhere('favorite.id = :favoriteId', { favoriteId })
      .orderBy('COUNT(like.id)', 'DESC')
      .groupBy('post.id')
      .limit(1)
      .getOne();
  }
}
