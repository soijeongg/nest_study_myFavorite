import { Injectable, Logger } from '@nestjs/common';
import * as cron from 'node-cron';
import { PostService } from '../post/post.service';
import { CategoryService } from '../category/category.service'; 
import { FavoriteService } from '../favorite/favorite.service';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);

  constructor(
    private readonly postService: PostService,
    private readonly categoryService: CategoryService,
    private readonly favoriteService: FavoriteService,
  ) {
    this.schedulePopularAndMostViewedPosts();
  }

  // 3시간마다 실행되는 작업 설정
  schedulePopularAndMostViewedPosts() {
    cron.schedule('0 0 */3 * * *', async () => {
      this.logger.debug('3시간마다 각 카테고리, 서브 카테고리, 서브 서브 카테고리, 페이버릿의 포스트를 조회합니다.');

      try {
        // 모든 카테고리, 서브 카테고리, 서브 서브 카테고리, 페이버릿, 그리고 포스트를 가져오기
        const categories = await this.categoryService.getAllCategoriesWithSubcategoriesAndFavorites();

        // 카테고리 계층을 순회하며 작업 수행
        for (const category of categories) {
          for (const subCategory of category.subCategories) {
            for (const subSubCategory of subCategory.subSubCategories) {
              for (const favorite of subSubCategory.favorites) {
                // 페이버릿에 속한 포스트 처리
                for (const post of favorite.posts) {
                  await this.handlePost(post, category.id, subCategory.id, subSubCategory.id, favorite.id);
                }
              }
            }
          }
        }
      } catch (error) {
        this.logger.error('스케줄 작업 중 오류 발생:', error);
      }
    });
  }

  // 포스트 처리 메서드
  async handlePost(post, categoryId: number, subCategoryId: number, subSubCategoryId: number, favoriteId: number) {
    this.logger.debug(`포스트: ${post.title} 처리 중...`);

    // 좋아요가 많은 게시글 조회
    const popularPosts = await this.postService.getPopularPosts(
      categoryId,
      subCategoryId,
      subSubCategoryId,
      favoriteId,
    );
    this.logger.debug(`인기 게시글:`, popularPosts);

    // 가장 인기 있는 Favorite 조회
    const mostPopularFavorite = await this.favoriteService.getMostPopularFavorite(
      categoryId, subCategoryId, subSubCategoryId,
    );
      
    if (mostPopularFavorite) {
      this.logger.debug(
        `인기있는 Favorite: ${mostPopularFavorite.name} (좋아요: ${mostPopularFavorite.totalLikes})`
      );
    } else {
      this.logger.debug('해당 서브 서브 카테고리에는 Favorite이 없습니다.');
    }
  }
}