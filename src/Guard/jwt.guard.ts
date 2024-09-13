import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuthGuard } from '@nestjs/passport';
import { TokenBlacklist } from '../user/entities/tokenBlacklist';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { Repository } from 'typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
    private readonly userService: UserService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
    });
  }

  // canActivate 메서드를 확장하여 블랙리스트 검증을 추가
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 기본 JWT 검증 로직을 먼저 수행
    const isActivated = await super.canActivate(context) as boolean;
    if (!isActivated) {
      throw new UnauthorizedException();
    }

    // 요청에서 JWT 토큰을 추출
    const request = context.switchToHttp().getRequest();
    const token = ExtractJwt.fromAuthHeaderAsBearerToken()(request);

    // 블랙리스트에 해당 토큰이 있는지 확인
    const isBlacklisted = await this.tokenBlacklistRepository.findOne({ where: { token } });
    if (isBlacklisted) {
      throw new UnauthorizedException('This token is blacklisted');
    }

    return true; // 블랙리스트에 없으면 요청을 계속 진행
  }
}
