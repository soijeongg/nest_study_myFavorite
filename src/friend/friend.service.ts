import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateFriendDto } from './dto/create-friend.dto';
import { UpdateFriendDto } from './dto/update-friend.dto';
import { FriendRequest } from './entities/friendRequests.entity';
import { Friend } from './entities/friend.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { EntityManager } from 'typeorm';
import { CreateFriendRequestDto } from './dto/createFriendRequest.dto';
import { UserService } from '../user/user.service';
import { User } from '../user/entities/user.entities';
import { userFriends } from './entities/userFriends.entity';
import { statusType } from './entities/friendRequests.entity';
import { WebSocketGatewayGateway } from 'src/web-socket-gateway/web-socket-gateway.gateway';
@Injectable()
export class FriendService {
  constructor(
    @InjectRepository(Friend) private friendRepository: Repository<Friend>,
    @InjectRepository(userFriends)
    private userFriendRepository: Repository<userFriends>,
    @InjectRepository(FriendRequest)
    private friendRequestRepository: Repository<FriendRequest>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private userService: UserService,
    private WebSocketGateway: WebSocketGatewayGateway,
    private readonly entityManager: EntityManager,
  ) {}
  //TODO: 친구 요청을 보낸다, 친구 요청 테이블에 저장
  async createFriendService(createDto: CreateFriendRequestDto, user: User) {
    return await this.entityManager.transaction(async (manager) => {
      const { userId } = createDto;
      //유저 아이디가 자신이 아닌지 확인
      if (user.userId == userId) {
        throw new HttpException(
          '자기자신에게는 친구 신청을 보낼 수 없습니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      const recipient = await manager.findOne(User, { where: { userId } });
      if (!recipient) {
        throw new HttpException(
          '존재하지 않는 유저에게 친구 신청을 보낼 수 없습니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const findRequestReq = await manager.findOne(FriendRequest, {
        where: { requester: user, recipient },
      });
      const findRequestRes = await manager.findOne(FriendRequest, {
        where: { requester: recipient, recipient: user },
      });
      //이미 친구 신청에 있는지 확인하기(자신이 보낸거 확인, 남이 보낸거 확인)
      if (findRequestReq || findRequestRes) {
        //친구 신청이 있는데 이미 삭제되어 reject되고 deleteAt이 날짜인 경우 다시 null과 펜딩으로 바꾸기
        if (findRequestReq && findRequestReq.deleteAt != null) {
          findRequestReq.deleteAt = null;
          findRequestReq.status = statusType.PENDING;
          return await manager.save(FriendRequest, findRequestReq);
        }
        if (findRequestRes && findRequestRes.deleteAt != null) {
          findRequestRes.deleteAt = null;
          findRequestRes.status = statusType.PENDING;
          return await manager.save(FriendRequest, findRequestRes);
        }
        // 이미 존재하는 친구 요청이 있으므로 예외 처리
        throw new HttpException(
          '이미 친구 신청이 존재합니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const newFriendRequest = manager.create(FriendRequest, {
        requester: user, // 요청을 보낸 유저
        recipient: { userId }, // 요청을 받는 유저
      });
      const saveFriendRequest = await manager.save(
        FriendRequest,
        newFriendRequest,
      );
      this.WebSocketGateway.handleFriendRequestNotification(
        userId,
        user.username,
      );
      return saveFriendRequest;
    });
  }

  //친구 신청 조회(내가 받은것)

  async getReceivedFriendRequests(user: User) {
    // 내가 받은 친구 요청을 조회 (recipient가 나인 경우)
    const receivedRequests = await this.friendRequestRepository.find({
      where: { recipient: user, deleteAt: null }, // 삭제되지 않은 친구 요청만 조회
      relations: ['requester'], // 친구 요청을 보낸 유저 정보 포함
    });
    return receivedRequests.map((request) => ({
      id: request.friendRequestId,
      requesterName: request.requester.username, // 친구 요청을 보낸 사람의 이름
      status: request.status,
      createdAt: request.createdAt,
    }));
  }
  //친구 신청 조회(내가 한것)

  async getSentFriendRequests(user: User) {
    // 내가 보낸 친구 요청을 조회 (requester가 나인 경우)
    const sentRequests = await this.friendRequestRepository.find({
      where: { requester: user, deleteAt: null }, // 삭제되지 않은 친구 요청만 조회
      relations: ['recipient'], // 친구 요청을 받은 유저 정보 포함
    });
    return sentRequests.map((request) => ({
      id: request.friendRequestId,
      recipientName: request.recipient.username, // 친구 요청을 받은 사람의 이름
      status: request.status,
      createdAt: request.createdAt,
    }));
  }
  //친구신청 수락

  async acceptedFriendService(friendRequestId: number, user: User) {
    //친구신청 아이디를 사용해 친구 신청이있는지 확인한다, 있으면 status바꾸로 userFriend에 넣는다
    //친구엔티티에 저장한다
    const findFriendRequest = await this.friendRequestRepository.findOne({
      where: {
        friendRequestId: friendRequestId,
      },
    });
    if (!findFriendRequest) {
      throw new HttpException('친구 신청이 없습니다', HttpStatus.BAD_REQUEST);
    }
    if (findFriendRequest.recipient != user) {
      throw new HttpException(
        '자신의 친구 신청이 아닙니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    //이미 친구에 있지만 deleteAt이 날짜여서 삭제 된것을 다시 deleteAt을 null로 바꾸고 status를 accepted로
    if (findFriendRequest.deleteAt != null) {
      findFriendRequest.deleteAt = null;
      findFriendRequest.status = statusType.ACCEPTED;
      return await this.friendRepository.save(findFriendRequest);
    }
    if (findFriendRequest.status != statusType.PENDING) {
      throw new HttpException(
        '유효하지 않는 친구신청입니다',
        HttpStatus.BAD_REQUEST,
      );
    }
    findFriendRequest.status = statusType.ACCEPTED;
    await this.friendRequestRepository.save(findFriendRequest);

    const newFriendRelationship = this.userFriendRepository.create({
      user: findFriendRequest.requester,
      friend: findFriendRequest.recipient,
    });
    await this.userFriendRepository.save(newFriendRelationship);

    const friend = this.friendRepository.create({
      userFriends: newFriendRelationship,
    });
    return await this.friendRepository.save(friend);
  }

  //TODO: 친구 신청 거절 및 친구신청 삭제 친구 신청을 찾고 status가 pending인지 확인,

  async rejectedFriendRequestService(friendRequestId: number, user: User) {
    // 친구 요청을 받았거나 보냈는지 확인
    const findFriendRequest = await this.friendRequestRepository.findOne({
      where: [
        { friendRequestId: friendRequestId, deleteAt: null, recipient: user },
        { friendRequestId: friendRequestId, deleteAt: null, requester: user },
      ],
    });
    // 친구 요청이 존재하지 않으면 에러 처리
    if (!findFriendRequest) {
      throw new HttpException('해당하는 친구 신청이 없습니다.', HttpStatus.NOT_FOUND);
    }
    // 친구 요청의 상태가 PENDING인지 확인
    if (findFriendRequest.status !== statusType.PENDING) {
      throw new HttpException('유효하지 않은 친구 신청 상태입니다.', HttpStatus.BAD_REQUEST);
    }

    // 친구 요청을 REJECTED로 변경하고 삭제 시간 기록
    findFriendRequest.status = statusType.REJECTED;
    findFriendRequest.deleteAt = new Date();

    // 변경된 친구 요청을 저장
    return await this.friendRequestRepository.save(findFriendRequest);
  }

  //TODO: 친구 조회, userFrined에 들어가서 유저로 조히
  async findFriendService(user: User) {
    const userFriends = await this.userFriendRepository.find({
      where: { user },
      relations: ['friends', 'user'],
    });
    const friends = userFriends.map((userFriend) => ({
      userName: userFriend.user.username,
      createdAt: userFriend.createAt,
    }));
    return friends;
  }

  //TODO: 친구 삭제
  async deleteFriendService(friendId: number, user: User) {
    return await this.entityManager.transaction(async (manager) => {
      const findFriend = await manager.findOne(Friend, {
        where: { friendId: friendId, deletedAt: null },
      });
      if (findFriend) {
        findFriend.deletedAt = new Date(); // Friend 엔티티도 논리 삭제 처리
        await manager.save(Friend, findFriend);
      }
      if (!findFriend) {
        throw new HttpException(
          '친구가 존재하지 않습니다',
          HttpStatus.BAD_REQUEST,
        );
      }
      // 1. 유저와 친구 ID를 사용해 친구 관계를 UserFriends 테이블에서 찾음
      const findFriendRelationship = await manager.findOne(userFriends, {
        where: [
          { user: user, friend: { friendId: friendId }, deletedAt: null }, // 유저가 친구인 경우
          { user: { userId: friendId }, friend: user, deletedAt: null }, // 유저가 친구로 등록된 경우
        ],
        relations: ['friend', 'user'],
      });

      if (!findFriendRelationship) {
        throw new HttpException(
          '존재하지 않는 친구 관계입니다.',
          HttpStatus.NOT_FOUND,
        );
      }

      // userFriend에서도 삭제
      findFriendRelationship.deletedAt = new Date();
      await manager.save(userFriends, findFriendRelationship);

      // FriendRequest 에서 삭제
      const findFriendRequest = await manager.findOne(FriendRequest, {
        where: [
          {
            requester: user,
            recipient: { userId: findFriendRelationship.user.userId },
            deleteAt: null,
          }, // 내가 보낸 친구 요청
          {
            requester: { userId: findFriendRelationship.user.userId },
            recipient: user,
            deleteAt: null,
          }, // 내가 받은 친구 요청
        ],
      });
      if (findFriendRequest) {
        findFriendRequest.status = statusType.REJECTED; // 친구 요청 상태를 REJECTED로 변경
        findFriendRequest.deleteAt = new Date(); // 친구 요청을 논리적으로 삭제
        await manager.save(FriendRequest, findFriendRequest);
      }
    });
  }
}
