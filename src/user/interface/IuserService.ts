import { User } from '../entities/user.entities';
import { createUserDTO, loginDTO, updateUserDTO } from '../DTO';

export interface IuserService {
  validateUser(email: string, password: string): Promise<User | undefined>;
  getAllService(): Promise<User[]>;
  createUserService(createDto: createUserDTO): Promise<User>;
  loginUserService(LoginDto: loginDTO): Promise<string>;
  findUserByID(userId: number): Promise<User | null>;
  updateUserService(updateDTO: updateUserDTO, user: User): Promise<User>;
  deleteUserService(userId: number): Promise<boolean>;
  searchUserService(username: string): Promise<User[] | User | null>;
  getOtherUserService(username: string): Promise<User>;
  logout(token: string): Promise<void>;
}
