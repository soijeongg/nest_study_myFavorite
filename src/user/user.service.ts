import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DeleteResult } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from './entities/user.entities';
import { createUserDTO, loginDTO, updateUserDTO } from './DTO';
import { IuserService } from './interface/IuserService';
//서비스는 모든 비즈니스 로직을 처리한다  -> 레포지토리는 오직 db접근만
@Injectable()
export class UserService implements IuserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private readonly jwtService: JwtService, //JwtService는 AuthModule에서 설정한 JwtModule을 통해 제공된 설정을 사용하여 작동
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const findEmail = await this.userRepository.findOne({
      where: { email, deletedAt: null },
      select: ['userId', 'email', 'password'],
    });
    if (findEmail && (await argon2.verify(findEmail.password, password))) {
      return findEmail;
    }
  }
  async getAllService() {
    return await this.userRepository.find();
  }

  async createUserService(createDto: createUserDTO): Promise<User> {
    const { password } = createDto;
    const hashPassword = await argon2.hash(password);
    const newUser = await this.userRepository.create({
      ...createDto,
      password: hashPassword,
    });
    return this.userRepository.save(newUser);
  }

  async loginUserService(LoginDto: loginDTO) {
    const { email, password } = LoginDto;
    const user = await this.validateUser(email, password);
    if (!user) {
      throw new HttpException('로그인에 실패했습니다', HttpStatus.BAD_REQUEST);
    }
    const payload = { id: user.userId, email: user.email };
    const accessToken = await this.jwtService.signAsync(payload);
    return accessToken;
  }
  async findUserByID(userId: number): Promise<User | null> {
    return this.userRepository.findOne({ where: { userId } });
  }
  async updateUserService(updateDTO: updateUserDTO): Promise<User> {
    const { email, username, password } = updateDTO;
    const user = await this.userRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('해당하는 유저가 없습니다', HttpStatus.NOT_FOUND);
    }
    if (username) {
      user.username = username;
    }
    if (password) {
      user.password = password;
    }
    return await this.userRepository.save(user);
  }
  async deleteUserService(userId: number): Promise<boolean> {
    const user = await this.userRepository.findOne({ where: { userId } });
    if (!user) {
      throw new HttpException('해당하는 유저가 없습니다', HttpStatus.NOT_FOUND);
    }
    const deleteResult: DeleteResult = await this.userRepository.delete(userId);
    return deleteResult.affected > 0;
  }
}
