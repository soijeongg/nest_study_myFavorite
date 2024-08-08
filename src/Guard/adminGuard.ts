import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { TokenBlacklist } from '../user/entities/tokenBlacklist';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class adminGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
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
    const isBlack = await this.tokenBlacklistRepository.findOne(token);
    if (isBlack) {
      throw new UnauthorizedException('로그아웃 된 상태입니다');
    }
    //검증
    const canActivateResult = await super.canActivate(context);
    return canActivateResult as boolean;
  }
  // canActivate는 토큰을 추출하고 비밀키를 사용해 검증한다
  handleRequest(err, user, info, context: ExecutionContext) {
    if (err) {
      throw err;
    }
    if (!user) {
      throw new UnauthorizedException('로그인에 실패했습니다');
    }
    if (user.status != 'admin') {
      throw new UnauthorizedException('관리자계정으로 로그인해주세요');
    }
    const request = context.switchToHttp().getRequest();
    request.user = user;
    return user;
  }
}
