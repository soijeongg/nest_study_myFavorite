import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TokenBlacklist } from '../user/entities/tokenBlacklist';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from '../user/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(TokenBlacklist)
    private readonly tokenBlacklistRepository: Repository<TokenBlacklist>,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET'),
      algorithms: ['HS256'],
    });
  }
  async validate(payload: any) {
    const user = await this.userService.findUserByID(+payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isBlacklisted = await this.tokenBlacklistRepository.findOne({
      where: { token: payload.jti },
    });
    if (isBlacklisted) {
      throw new UnauthorizedException('Token is blacklisted');
    }
    return { ...user };
  }
}
// 발급하고 검증하는 코드
