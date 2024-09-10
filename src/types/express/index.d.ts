import { User } from "src/user/entities/user.entities"; // User 엔티티 경로에 맞춰서 import

declare global {
  namespace Express {
    interface Request {
      user?: User; // Request 객체에 user 속성 추가
    }
  }
}
