import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { IfriendService } from './interface/IfriendService';
import { Friend } from './entities/friend.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entities';

@Injectable()
export class FriendService implements IfriendService {
  constructor(
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
    private userService: UserService,
  ) {}
  async createFriendService(createDto: CreateFriendDto, user: User): Promise<Friend> {
    const { recipientName } = createDto;
    const recipient = await this.userService.getOtherUserService(recipientName);
    const friend = await this.friendRepository.create({
      recipient,
      requester: user,
    });
    return await this.friendRepository.save(friend);
  }

  async updateFriendService(updateDto: UpdateFriendDto, user: User): Promise<Friend> {
    const { recipientName, status } = updateDto;
    if (status !== 'accepted' && status !== 'rejected') {
      throw new HttpException('잘못된 상태 입니다', HttpStatus.BAD_REQUEST);
    }
    // 해당 요청자를 찾습니다.
    const recipient = await this.userService.getOtherUserService(recipientName);

    // 친구 관계를 업데이트합니다.
    const friend = await this.friendRepository.findOne({
      where: { requester: user, recipient: recipient },
    });
    if (!friend) {
      throw new HttpException(
        '친구 관계를 찾을 수 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }

    friend.status = status;
    return this.friendRepository.save(friend);
  }

  async getAllFriendService(username: string): Promise<Friend[]> {
    const user = await this.userService.getOtherUserService(username);
    return await this.friendRepository.find({
      where: [{ recipient: user }, { requester: user }],
    });
  }

  async deleteFriendService(user: User, username: string): Promise<boolean> {
    const friendUser = await this.userService.getOtherUserService(username);

    if (!friendUser) {
      throw new HttpException('친구를 찾을 수 없습니다', HttpStatus.NOT_FOUND);
    }
    const friend = await this.friendRepository.findOne({
      where: [
        { requester: user, recipient: friendUser },
        { requester: friendUser, recipient: user },
      ],
    });

    if (!friend) {
      throw new HttpException(
        '친구 관계를 찾을 수 없습니다',
        HttpStatus.NOT_FOUND,
      );
    }
    const deleteResult: DeleteResult = await this.friendRepository.delete(
      friend.id,
    );
    return deleteResult.affected > 0;
  }

  async searchFriendService(
    searchTerm: string,
    username: string,
  ): Promise<Friend[]> {
    const user = await this.userService.getOtherUserService(username);

    if (!user) {
      throw new HttpException('유저를 찾을 수 없습니다', HttpStatus.NOT_FOUND);
    }

    // 검색어에 해당하는 친구 관계를 찾습니다.
    const friends = await this.friendRepository.find({
      where: [
        { requester: user, recipient: { username: searchTerm } },
        { recipient: user, requester: { username: searchTerm } },
      ],
      relations: ['requester', 'recipient'],
    });

    if (friends.length === 0) {
      throw new HttpException('친구를 찾을 수 없습니다', HttpStatus.NOT_FOUND);
    }

    return friends;
  }
}
