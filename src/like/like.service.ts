import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { IlikeService } from './interface/ILikeService';
import { InjectRepository } from '@nestjs/typeorm';
import { Like } from './entities/like.entity';
import { DeleteResult, In, Repository } from 'typeorm';
import { PostService } from 'src/post/post.service';
import { User } from 'src/user/entities/user.entities';
import { Posts } from 'src/post/entities/post.entities';
import { UserService } from 'src/user/user.service';
@Injectable()
export class LikeService implements IlikeService {
  constructor(
    @InjectRepository(Like) private LikeRepository: Repository<Like>,
    private postService: PostService,
    private userService: UserService,
  ) {}
  async createLikeService(postId: number, user: User): Promise<Like> {
    const post = await this.postService.findOnePostService(postId);
    if (!post) {
      throw new HttpException(
        '해당하는 포스트가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const newLike = await this.LikeRepository.create({
      post,
      user,
    });
    return await this.LikeRepository.save(newLike);
  }

  async getAllLikeService(user: User): Promise<Like[]> {
    return await this.LikeRepository.find({
      where: { user },
    });
  }
  async deleteLikeService(postId: number, user: User): Promise<boolean> {
    const post = await this.postService.findOnePostService(postId);
    if (!post) {
      throw new HttpException(
        '해당하는 포스트가 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const findlike = await this.LikeRepository.findOne({
      where: {
        post: post,
        user: user,
      },
    });
    if (!findlike) {
      throw new HttpException('삭제할 좋아요가 없습니다', HttpStatus.NOT_FOUND);
    }
    const deleteResult: DeleteResult = await this.LikeRepository.delete(
      findlike.likeId,
    );
    return deleteResult.affected > 0;
  }
  async searchLikeService(
    searchTerm: string,
    username: string,
  ): Promise<Like[]> {
    //포스트 검색 기능을 가져와서 검색 한 뒤, 거기에서 유저가 나면 가져오기
    const post = await this.postService.searchPostService(searchTerm);
    const user = await this.userService.getOtherUserService(username);
    const postIds = post.map((post) => post.PostsId); //각 아이디만 추출
    return this.LikeRepository.find({
      where: { post: { PostsId: In(postIds) }, user }, //포스트의 아이디가 포함되어 있는것만
    });
  }

  async getOtherLikeService(username: string): Promise<Like[]> {
    const User = await this.userService.getOtherUserService(username);
    if (!User) {
      throw new HttpException('해당하는 유저가 없습니다', HttpStatus.NOT_FOUND);
    }
    return await this.LikeRepository.find({
      where: { user: User },
    });
  }
  // TODO: 친구신청, 친구수랑(상태바꾸기), 친구거절(상태바꾸기), 친구삭제, 내친구보기, 내친구 검색, 남의 친구보기, 남의 친구 검색
  //TODO: ERD 그리기, 사진 올리는거 s3 쓸 수 있는지 어떻게??
  //TODO: 일단 라이크 다 완성하고 그 후 한번 포스트, 코멘트,페이보릿,라이크 한번 돌리고 aws S3시도 => 친구
  //TODO:  그 후 리액트 기초
}
