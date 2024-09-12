import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User, userType } from './entities/user.entities';
import { createUserDTO, loginDTO, updateUserDTO } from './DTO';
import { IuserService } from './interface/IuserService';
import { TokenBlacklist } from './entities/tokenBlacklist';
import { userFavorite } from 'src/user/entities/userFavorite.entities';
//서비스는 모든 비즈니스 로직을 처리한다  -> 레포지토리는 오직 db접근만
@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService, //JwtService는 AuthModule에서 설정한 JwtModule을 통해 제공된 설정을 사용하여 작동
    @InjectRepository(TokenBlacklist)
    private tokenBlacklistRepository: Repository<TokenBlacklist>,
    @InjectRepository(userFavorite)
    private userFavoriteRepostiory: Repository<userFavorite>,
  ) {}
  //TODO:로그인을 위한 이메일 검사 및 비밀번호 확인
  async validateUser(email: string, password: string): Promise<any> {
    const findEmail = await this.userRepository.findOne({
      where: { email, deletedAt: null },
    });
    if (findEmail && (await argon2.verify(findEmail.password, password))) {
      return findEmail;
    }
    return null;
  }
  async getAllService(user: User) {
    if (user.status != userType.ADMIN) {
      throw new HttpException('권한이 없습니다', HttpStatus.BAD_REQUEST);
    }
    return await this.userRepository.find();
  }

  //TODO: 회원가입, 이메일, 비밀번호, 닉네임, 상태를 받아 저장한다
  async createUserService(createDto: createUserDTO, profilePic: string |null): Promise<User> {
    const { password, email, username, status } = createDto;
    const hashPassword = await argon2.hash(password);
    //이메일 닉네임 중복체크
    const findEmail = await this.userRepository.findOne({
      where: { email, deletedAt: null },
    });
    if (findEmail) {
      throw new HttpException(
        '이메일이 중복되었습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    //이메일은 없지만 닉네임이 중복된 경우
    const findName = await this.userRepository.findOne({
      where: {
        username,
        deletedAt: null,
      },
    });
    if (findName) {
      throw new HttpException(
        '닉네임이 중복되었습니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newUser = await this.userRepository.create({
      ...createDto,
      status,
      profilePic: profilePic ? profilePic: null,
      password: hashPassword,
    });
    return this.userRepository.save(newUser);
  }

  //TODO: 로그인
  async loginUserService(LoginDto: loginDTO) {
    const { email, password } = LoginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new HttpException('로그인에 실패했습니다', HttpStatus.BAD_REQUEST);
    }
    const payload = { sub: user.userId, status: user.status };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  //TODO: 유저 아이디를 사용해 유저 반환, 다른 곳에서 사용
  async findUserByID(userId: number): Promise<User | null> {
    const user = await this.userRepository.findOne({ where: { userId, deletedAt: null }});
    if (!user) {
      throw new HttpException('해당하는 유저가 없습니다', HttpStatus.NOT_FOUND);
    }
    return user;
  }

  //TODO: 유저 업데이트
  async updateUserService(
    updateDTO: updateUserDTO,
    userId: number,
    profilePic: string,
  ) {
    const { username, password, status } = updateDTO;
    const find = await this.userRepository.findOne({ where: { userId } });
    if (!find) {
      throw new HttpException('해당하는 유저가 없습니다', HttpStatus.NOT_FOUND);
    }

    if (username) {
      //유저 네임이 존재하는지 확인
      const check = await this.userRepository.findOne({
        where: { username, deletedAt: null },
      });
      if (check) {
        throw new HttpException(
          '중복된 이름이 존재합니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      find.username = username;
    }
    if (password) {
      find.password = await argon2.hash(password);
    }
    if (status) {
      find.status = status;
    }
    if (profilePic) {
      find.profilePic = profilePic;
    }
    find.updatedAt = new Date();
    const newUser = await this.userRepository.save(find);
    return {
      email: newUser.email,
      username: newUser.username,
      status: newUser.status,
    };
  }
  //TODO: 회원 삭제 소프트 삭제
  async deleteUserService(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new HttpException('해당하는 유저가 없습니다', HttpStatus.NOT_FOUND);
    }
    user.deletedAt = new Date();
    await this.userRepository.save(user);
    return true;
  }
  async searchUserService(username: string): Promise<User[] | User | null> {
    return this.userRepository.find({
      where: [{ username: Like(`%${username}%`) }],
    });
  }
  //TODO: 남의 꺼 가져오기
  //남의 유저 아이디가 들어오면 유저 아이디를 검사하고 해당 유저의 닉네임, 포스트아(익명이 아닐경우), 댓글(익명이 아닐경우)
  async getOtherUserService(userId: number) {
    const user = await this.userRepository.findOne({
      where: {
        userId: userId,
      },
      relations: ['userFavorite', 'posts', 'comments'],
    });
    return {
      usernaame: user.username,
      posts: user.posts
        .filter((post) => !post.anonymous)
        .map((post) => ({
          postId: post.postId,
          title: post.title,
          description: post.description,
          imageUrl: post.imageUrl,
          createAt: post.createAt,
        })),
      comments: user.comments
        .filter((Comment) => !Comment.anonymous)
        .map((Comment) => ({
          commentId: Comment.commentId,
          comtent: Comment.content,
          createAt: Comment.createdAt,
        })),
      userFavorite: user.userFavorites.map((userFavorite) => ({
        userFavoriteId: userFavorite.userFavoriteId,
        favoriteId: userFavorite.favorite.favoriteId,
        favoriteName: userFavorite.favorite.name,
      })),
    };
  }

  //내꺼 닉네임,포스트, 댓글, 가져오기 나는 익명이여도 전부 가져오기
  async findMe(userId: number) {
    const user = await this.userRepository.findOne({
      where: { userId },
      relations: ['posts', 'comments', 'userFavorites'],
    });
    return {
      usernaame: user.username,
      posts: user.posts.map((post) => ({
        postId: post.postId,
        title: post.title,
        description: post.description,
        imageUrl: post.imageUrl,
        createAt: post.createAt,
      })),
      comments: user.comments.map((comment) => ({
        commentId: comment.commentId,
        content: comment.content,
        createAt: comment.createdAt,
      })),
      userFavorite: user.userFavorites.map((userFavorite) => ({
        userFavoriteId: userFavorite.userFavoriteId,
        favoriteId: userFavorite.favorite.favoriteId,
        favoriteName: userFavorite.favorite.name,
      })),
    };
  }

  async logout(token: string): Promise<void> {
    const decodedToken = this.jwtService.decode(token) as any;
    const expiresAt = new Date(decodedToken.exp * 1000);

    const tokenBlacklist = new TokenBlacklist();
    tokenBlacklist.token = token;
    tokenBlacklist.expiresAt = expiresAt;

    await this.tokenBlacklistRepository.save(tokenBlacklist);
  }

  async refreshService(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken);
    if (!payload || !payload.sub) {
      throw new HttpException(
        '유효하지 않은 토큰입니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    const newAccessToken = this.jwtService.sign(
      { sub: payload.sub },
      { expiresIn: '1h' },
    );
    return {
      access_token: newAccessToken,
    };
  }
}
