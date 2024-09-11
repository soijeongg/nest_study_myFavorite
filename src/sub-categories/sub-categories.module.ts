import { Module } from '@nestjs/common';
import { SubCategoriesService } from './sub-categories.service';
import { SubCategoriesController } from './sub-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategory } from './entities/sub-category.entity';
import { User } from 'src/user/entities/user.entities';
import { CategoriesModule } from 'src/categories/categories.module';
import { UserModule } from 'src/user/user.module';
import { TokenBlacklist } from 'src/user/entities/tokenBlacklist';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubCategory, User, TokenBlacklist]),
    CategoriesModule,
    UserModule,
  ],
  controllers: [SubCategoriesController],
  providers: [SubCategoriesService],
})
export class SubCategoriesModule {}
