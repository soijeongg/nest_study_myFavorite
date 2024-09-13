import { CanActivate, ExecutionContext, Injectable,   UnauthorizedException, } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Socket } from 'socket.io';
import { TokenBlacklist } from 'src/user/entities/tokenBlacklist';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class WsJwtGuardGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(TokenBlacklist)
    private tokenBlacklistRepository: Repository<TokenBlacklist>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    //검증하는 부분
    const client = context.switchToWs().getClient<Socket>();
    const authHeader = client.handshake.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedException('Authorization header missing');
    }
    //토큰 종류가 bearer인지 확인
    const [bearer, token] = authHeader.split(' ');
    if (bearer !== 'Bearer' || !token) {
      throw new UnauthorizedException('Invalid token format');
    }
    //토큰블랙리스트에 있는지 확인
    const isBlack = await this.tokenBlacklistRepository.findOne({where:{token}});
    if (isBlack) {
      throw new UnauthorizedException('로그아웃 된 상태입니다');
    }
    //검증
    const payload = this.jwtService.verify(token); // JWT 검증
    client.handshake.auth = { user: payload }; // 유저 정보를 저장하여 사용할 수 있게 함
    return true;
  }
}
