import { Like } from '../entities/like.entity';
import { User } from 'src/user/entities/user.entities';
export interface IlikeService {
  createLikeService(postId: number, user: User): Promise<Like>;
  deleteLikeService(postId: number, user: User): Promise<boolean>;
  getAllLikeService(user: User): Promise<Like[]>;
  searchLikeService(searchTerm: string, username: string): Promise<Like[]>;
  getOtherLikeService(username: string): Promise<Like[]>;
}

// TODO: 인터페이스에 남의 좋아요보기와(파람으로 유저 아이디)와 남의 좋아요에서 검색하는거(이거 검색한 다음, 유저아이디로유저 찾아서 그 유저이면 가져오기)
