import { Injectable } from '@nestjs/common'; //종속성주입
import { ConfigService } from '@nestjs/config'; //.env 위해
import { JwtModuleOptions, JwtOptionsFactory } from '@nestjs/jwt';

@Injectable()
export class JwtConfigService implements JwtOptionsFactory {
  constructor(private readonly configService: ConfigService) {}

  createJwtOptions(): JwtModuleOptions {
    return {
      secret: this.configService.get<string>('JWT_SECRET'),
      signOptions: { expiresIn: '3600s' },
      verifyOptions: {
        algorithms: ['HS256'],
      },
    };
  }
}

// JwtModuleOptions JwtModule을 설정시 사용하는 옵션들(secret, signOptions(시간), verifyOptions(알고리즘 선택)
