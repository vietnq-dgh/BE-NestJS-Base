import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
// import { Logger } from '@nestjs/common';
import { Socket, Server } from 'socket.io';
import { Connection } from 'typeorm';
import { Logger } from '@nestjs/common';
import { SOCKET_EVENTs } from './common/configs';
import { PublicModules } from './common/PublicModules';

const getOptions = () => {
  if (String(process.env.ENV) === 'DEV')
    return {
      cors: {
        origin: '*',
        methods: ["GET", "POST"],
        credentials: true
      },
    };
  return {
    cors: {
      origin: [String(process.env.APP_FRONT_END)],
      methods: ["GET", "POST"],
      credentials: true
    },
    path: '/socket-mess',
  };
};

let count = 0;

@WebSocketGateway(getOptions())
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer() server: Server;
  private logger: Logger = new Logger('AppGateway');
  private timerQueueCount = null;

  constructor(
    private readonly connection: Connection,
  ) {
    this.startTimerQueueCount();
  }

  private startTimerQueueCount = async () => {
    clearInterval(this.timerQueueCount);
    this.timerQueueCount = setInterval(async () => {
      const result = {
        todayEarn: 0,
        count,
        lastUpdate: PublicModules.fun_getCurrentTimestampUTC_Moment(),
      };
      this.server.emit(SOCKET_EVENTs.UPDATE_TODAY_EARN, result)

      count++;
      if (count > 10000) {
        count = 0;
      }
    }, 1000);
  }

  private insertUserOnline = async (userId: string) => {

  }

  private removeUserOnline = async (userId: string) => {

  }

  private inserMessageOnDB = async (args: any) => {

  }

  async makeReadMessage(userNameFrom: string, room: string) {

  }

  @SubscribeMessage('test')
  test() {
    this.logger.log('test')
  }

  @SubscribeMessage('serverMakeReadMessage')
  handleMakeReadMessage(_client: Socket, args: any) {
    const { room, from } = args;
    this.makeReadMessage(from, room);
  }

  @SubscribeMessage('sendMessage')
  handleMessage(_client: Socket, args: any) {
    const { room, message, from, to } = args;
    if (!room || !message || !from || !to) return;

    this.inserMessageOnDB(args)
      .then((dataRes) => {

      });
  }

  @SubscribeMessage('joinRoom')
  handleJoinRoom(client: Socket, args: any) {
    const { room, toId } = args;
    client.join(room);
    const { userId } = client.handshake.query;
    // make read message from db.
    this.makeReadMessage(toId, room);
    this.server.to(userId).emit('makeReadMessage', { ...args });
  }

  @SubscribeMessage('leaveRoom')
  hadleLeaveRoom(client: Socket, args: any) {
    const { room } = args;
    client.leave(room);
    const { userId } = client.handshake.query;
    this.server.to(userId).emit('onLeaveRoom', { args });
  }

  afterInit(_server: Server) {
    this.logger.log('Init');
  }

  handleDisconnect(client: Socket) {
    const { userId } = client.handshake.query;
    this.logger.log('disconnected');
    if (userId) {
      client.leave(userId.toString());
      setTimeout(() => {
        this.removeUserOnline(userId.toString())
      }, 10000);
    }
  }

  handleConnection(client: Socket) {
    this.logger.log('connected: ', client.request.url);
  }
}
