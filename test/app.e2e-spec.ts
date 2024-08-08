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
    const filePath = path.resolve(__dirname, 'test.png');
    const response = await request(app.getHttpServer())
      .post('/favorite')
      .set('Authorization', `Bearer ${token}`)
      .field('categories', 'Category1')
      .field('name', 'Favorite Name')
      .field('description', 'This is a test description')
      .attach('file', filePath) // 파일 경로는 실제 파일 경로로 변경
      .expect(201);
    const uploadedFileName = response.body.file; // 서버에서 응답한 파일 이름
    const uploadedFilePath = path.resolve(__dirname, '../uploads', uploadedFileName);
    expect(response.body).toHaveProperty('favoriteId');
    expect(response.body).toHaveProperty('categories', 'Category1');
    expect(response.body).toHaveProperty('name', 'Favorite Name');
    expect(response.body).toHaveProperty(
      'description',
      'This is a test description',
    );
    expect(response.body).toHaveProperty('imageUrl');
    expect(fs.existsSync(uploadedFilePath)).toBe(true);
  });

  //모든 테스트가 완료된 후  할 작업 정의
  afterAll(async () => {
    await app.close();
  });
});
