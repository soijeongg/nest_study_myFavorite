import { Module } from '@nestjs/common';
import { SubSubCategoriesService } from './sub-sub-categories.service';
import { SubSubCategoriesController } from './sub-sub-categories.controller';

@Module({
  controllers: [SubSubCategoriesController],
  providers: [SubSubCategoriesService],
})
export class SubSubCategoriesModule {}
