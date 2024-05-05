import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { PrismaService } from '../database/prisma/prisma.service';

@WebSocketGateway({ cors: true })
export class WebsocketService implements OnGatewayConnection {
  constructor(private prismaService: PrismaService) {}

  handleConnection() {
    // console.log(client.handshake.auth.userId);
  }

  afterInit() {
    console.log('Initialized');
  }

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('notify')
  handleEvent(@MessageBody() data: string): string {
    return data;
  }

  async sendNotification(userId: string, message: string) {
    let toSend: string;
    for (const [socketId, socket] of this.server.of('/').sockets) {
      if (userId === socket.handshake.auth.userId) {
        toSend = socketId;
        break;
      }
    }

    const notification = await this.prismaService.notification.create({
      data: {
        message,
        userId,
      },
    });

    this.server.to(toSend).emit('notify', notification);
  }
}
