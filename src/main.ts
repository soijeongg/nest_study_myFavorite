import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomValidationPipe } from './pipe/CustomValidationPipe';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { httpExceptionFilter } from './exception/http.exception';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads',
  });
  app.useGlobalPipes(new CustomValidationPipe());
  app.useGlobalFilters(new httpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('simple posts')
    .setDescription('simple posts description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
