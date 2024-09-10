import { PartialType } from '@nestjs/swagger';
import { CreateSubSubCategoryDto } from './create-sub-sub-category.dto';

export class UpdateSubSubCategoryDto extends PartialType(CreateSubSubCategoryDto) {}
