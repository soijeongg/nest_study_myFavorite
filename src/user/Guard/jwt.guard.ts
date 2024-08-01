import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest(); // HTTP 요청 객체 추출
    console.log('HTTP Headers:', request.headers); // 요청 헤더 로그 출력
    return super.canActivate(context); //기본 authGurard의 canActivate
  }
  // canActivate는 토큰을 추출하고 비밀키를 사용해 검증한다ㄴ

  handleRequest(err, user, info, context: ExecutionContext) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }

    const request = context.switchToHttp().getRequest();
    request.user = user; // user 정보를 req.user에 저장

    return user;
  }
}
