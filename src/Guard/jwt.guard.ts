import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBlacklist } from '../user/entities/tokenBlacklist';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable() //주입가능한 시스템으로 만들기
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
    private readonly userService: UserService,
  ) {
    super();
  } //토큰블랙리스트를 주입받고  호출하여 부모 클래스인 AuthGuard의 생성자를 호출
  //요청이 유효한지 확인하고, 유효하지 않으면 예외
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization;

    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    //토큰 종류가 bearer인지 확인
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }
    //토큰블랙리스트에 있는지 확인
    const isBlack = await this.tokenBlacklistRepository.findOne({ where: { token } });
    if (isBlack) {
      throw new UnauthorizedException('로그아웃 된 상태입니다');
    }
    const result = (await super.canActivate(context)) as boolean;

    if (result) {
      const user = request.user;
      const dbUser = await this.userService.findUserByID(user.id);
      if (!dbUser) {
        throw new UnauthorizedException('유저의 정보가 없습니다');
      }
      request.user = dbUser;
    }

    return result;
  }

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err) {
      throw err;
    }
    if (!user) {
      throw new UnauthorizedException('로그인에 실패했습니다');
    }
    const request = context.switchToHttp().getRequest();
    request.user = user;
    return user;
  }
}
