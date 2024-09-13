import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { JwtService } from '@nestjs/jwt';
import * as path from 'path';
import * as fs from 'fs';

describe('AppController (e2e)', () => {
  let app: INestApplication; //테스트할 애플리케이션 인스탄스를 자징할 변수
  let jwtService: JwtService;
  let token: string;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    jwtService = moduleFixture.get<JwtService>(JwtService);
    token = jwtService.sign({
      userId: 1,
      status: 'normal',
    });
    await app.init();
  });

  it('should register a new user', async () => {
    const response = await request(app.getHttpServer())
      .post('/user')
      .send({
        username: 'testuser',
        email: 'test@example.com',
        password: 'testpassword',
      })
      .expect(201);
    expect(response.body).toHaveProperty('userId');
    expect(response.body).toHaveProperty('username', 'testuser');
  });

  it('should log in the registered user', async () => {
    const response = await request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: 'test@example.com',
        password: 'testpassword',
      })
      .expect(200);
    expect(response.body).toHaveProperty('accessToken');
  });

  it('should upload favorite', async () => {
    const response = await request(app.getHttpServer())
      .post('/categories/1/subCategories/1/subSubCategories/1/favorite/1/posts')
      .set('Authorization', `Bearer ${token}`)
      .field('title', 'testPostTitle')
      .field('description', 'test descriptiondescription')
      .expect(201);
    expect(response.body).toHaveProperty('favoriteId');
    expect(response.body).toHaveProperty('title', 'testPostTitle');
    expect(response.body).toHaveProperty(
      'description',
      'test descriptiondescription',
    );
  });

  //모든 테스트가 완료된 후  할 작업 정의
  afterAll(async () => {
    await app.close();
  });
});
