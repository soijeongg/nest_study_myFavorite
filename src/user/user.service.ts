import { Injectable,HttpException, HttpStatus} from "@nestjs/common";
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as argon2 from 'argon2';
import { User } from './entities/user.entities';
import { createUserDTO, loginDTO } from './DTO';
//서비스는 모든 비즈니스 로직을 처리한다  -> 레포지토리는 오직 db접근만
@Injectable()
export class UserService {
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
}
