import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { Repository } from 'typeorm';
import { TokenBlacklist } from './entities/tokenBlacklist';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entities';
import { createUserDTO } from './DTO';

describe('UserService', () => {
  let service: UserService;
  let tokenBlacklistRepository: jest.Mocked<Repository<TokenBlacklist>>;
  let jwtService: JwtService;
  let userRepository: jest.Mocked<Repository<User>>;
  //테스트가 실행되기 전에 실행되는 설정코드
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        //의존성 주입
        UserService,
        {
          provide: getRepositoryToken(User), //주어진 엔티티에 대한 리포지토리 토큰을 생성
          useValue: { findOne: jest.fn(), create: jest.fn(), save: jest.fn() }, //mocking
        },
        {
          provide: getRepositoryToken(TokenBlacklist),
          useValue: { save: jest.fn() },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn(), //모킹 함수로 대체
            decode: jest.fn(),
          },
        },
      ],
    }).compile(); //테스트 모듈 생성, 컴ㅏ일

    service = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
    tokenBlacklistRepository = module.get(getRepositoryToken(TokenBlacklist));
    jwtService = module.get<JwtService>(JwtService);
  }); //유저 서비스 인스턴스 가져와서 service에 할당
  //정의 되어 있는지 확인

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  describe('validateUser', () => {
    //제대로 됐는지 확인
    it('비밀번호가 맞는지 확인하는 validateUser 함수 test', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const mockUser = {
        userId: 1,
        email,
        password: await argon2.hash(password),
      }; //목업객체

      userRepository.findOne.mockResolvedValue(mockUser as User);
      //mockReturnValue함수는 findOne이 mockUser를 반환하게 함
      jest.spyOn(argon2, 'verify').mockResolvedValue(true);
      // jest.spyOn은 특정모듈의 메서드 감시(호출 가로채고 모킹 할 수 있게함)
      //mockResolvedValue함수는 비동기 함수의 반환값을 설정한다(true)
      //그러니까 목업 함수는 항상 user가 되게
      const result = await service.validateUser(email, password);
      expect(result).toEqual(mockUser);
    });

    it('비밀번호가 맞지 않을 경우 validateUser 함수 test', async () => {
      const email = 'test@test.com';
      const password = 'password';
      const user = {
        userId: 1,
        email,
        password: await argon2.hash('wrong'),
      };
      userRepository.findOne.mockResolvedValue(user as User);
      jest.spyOn(argon2, 'verify').mockResolvedValue(false);
      const result = await service.validateUser(email, password);
      expect(result).toBeNull();
    });
  });

  //createUserService
  describe('createUserService', () => {
    it('createUserService가 제대로 작동하는지', async () => {
      const userDto: createUserDTO = {
        email: 'test@gmail.com',
        password: '12345',
        username: 'test',
      };
      const saveUser: User = {
        ...userDto,
        userId: 1,
        password: await argon2.hash('123245'),
        status: 'normal',
        createdAt: new Date(),
        updatedAt: null,
        deletedAt: null,
        posts: [],
        favorites: [],
        comments: [],
        likes: [],
        friendsRequested: [],
        friendsReceived: [],
      };

      userRepository.create.mockReturnValue(saveUser);
      userRepository.save.mockResolvedValue(saveUser);
      const result = await service.createUserService(userDto);
      expect(result).toEqual(saveUser);
    });
  });
});
