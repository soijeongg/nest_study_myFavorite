import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { httpExceptionFilter } from './exception/http.exception';
import * as cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new httpExceptionFilter());
  const config = new DocumentBuilder()
    .setTitle('simple posts')
    .setDescription('simple posts description')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  app.use(cookieParser());
  SwaggerModule.setup('docs', app, document);
  await app.listen(3000);
}
bootstrap();
