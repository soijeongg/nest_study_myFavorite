import { User } from '../entities/user.entities';
import { createUserDTO, updateUserDTO, loginDTO } from '../DTO';
import { Request, Response } from 'express';

export interface IuserController {
  findAllController(): Promise<User[]>;
  createUserController(createDto: createUserDTO): Promise<User>;
  loginController(LoginDTO: loginDTO, res: Response): Promise<void>;
  getuserIdController(req: Request, res: Response): Promise<User>;
  updateUserController(updateDTO: updateUserDTO, res: Response): Promise<void>;
  deleteUserController(req: Request, res: Response): Promise<void>;
}
