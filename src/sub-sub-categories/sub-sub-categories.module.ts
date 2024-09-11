import { Module } from '@nestjs/common';
import { SubSubCategoriesService } from './sub-sub-categories.service';
import { SubSubCategoriesController } from './sub-sub-categories.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubCategoriesModule } from 'src/sub-categories/sub-categories.module';
import { UserModule } from 'src/user/user.module';
import { SubSubCategory } from './entities/sub-sub-category.entity';
import { User } from 'src/user/entities/user.entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([SubSubCategory, User]),
    SubCategoriesModule,
    UserModule,
  ],
  controllers: [SubSubCategoriesController],
  providers: [SubSubCategoriesService],
})
export class SubSubCategoriesModule {}
