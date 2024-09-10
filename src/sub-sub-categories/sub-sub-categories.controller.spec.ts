import { Test, TestingModule } from '@nestjs/testing';
import { SubSubCategoriesController } from './sub-sub-categories.controller';
import { SubSubCategoriesService } from './sub-sub-categories.service';

describe('SubSubCategoriesController', () => {
  let controller: SubSubCategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubSubCategoriesController],
      providers: [SubSubCategoriesService],
    }).compile();

    controller = module.get<SubSubCategoriesController>(SubSubCategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
