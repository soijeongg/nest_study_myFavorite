import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class adminGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    return super.canActivate(context); //기본 authGurard의 canActivate
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
