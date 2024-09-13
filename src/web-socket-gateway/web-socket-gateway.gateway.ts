import { UseGuards } from '@nestjs/common';
import { OnGatewayConnection, SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { WsJwtGuardGuard } from 'src/Guard/ws-jwt-guard.guard';
import { Socket } from 'socket.io';

@WebSocketGateway({namespace: '/notifications'}) //이름 지정
@UseGuards(WsJwtGuardGuard)
export class WebSocketGatewayGateway implements OnGatewayConnection {
  private clients: Map<string, Socket> = new Map();


  handleConnection(client: Socket) {
    // 유저 정보를 가져와서 해당 유저의 ID를 클라이언트 소켓과 매핑
    const user = client.handshake.auth.user;
    if (user && user.userId) {
      this.clients.set(user.userId, client); // user.id를 key로 소켓을 저장
    }
    console.log(`User connected: ${user.userId}`);
  }

  handleDisconnect(client: Socket) {
    const user = client.handshake.auth.user;
    if (user && user.userId) {
      this.clients.delete(user.userId); // 유저가 연결 해제될 때 소켓 삭제
      console.log(`User disconnected: ${user.userId}`);
    }
  }

  //TODO: 만들어야 하는 알람(포스트 좋아요, 댓글좋아요, 친구 신청이왔을때)
  handleLikeNotification(postOwnerId: number, likerName: string, postId: number) {
    const client = this.clients.get(postOwnerId.toString());
    if (client) {
      client.emit('notification', `${likerName}님이 포스트 ${postId}에 좋아요를 눌렀습니다.`);
    }
  }

  // 댓글 좋아요 알림
   handleCommentLikeNotification(commentOwnerId: number, likerName: string, commentId: number) {
    const client = this.clients.get(commentOwnerId.toString());
    if (client) {
      client.emit('notification', `${likerName}님이 댓글 ${commentId}에 좋아요를 눌렀습니다.`);
    }
  }
  // 친구 신청 알림
  handleFriendRequestNotification(receiverId: number, senderName: string) {
    const client = this.clients.get(receiverId.toString());
    if (client) {
      client.emit('notification', `${senderName}님이 친구 요청을 보냈습니다.`);
    }
  }
}
