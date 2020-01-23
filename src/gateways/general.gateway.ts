import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { UserService } from '../modules/user/user.service';
import * as moments from 'moment';
import * as momentstz from 'moment-timezone';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class GeneralGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('Gateway: General');

  @WebSocketServer() private readonly server: any;
  constructor(private readonly userService: UserService) {}

  handleDisconnect(client: Socket) {
    const timezone = momentstz()
      .tz('America/New_York')
      .utc()
      .format();

    const time = moments(timezone)
      .add(15, 'minutes')
      .toDate();

    if (client.handshake.query.online === 1) {
      this.server.emit(`USER:${client.handshake.query.USER}:ONLINE`, { online: false });
      /*this.logger.log(
        `User ${client.handshake.query.user} with session ID ${client.handshake.query.session} and with Socket Id ${client.id} has been disconnected.`,
      );*/
      return this.userService.updateOnlineUser(client.handshake.query.user, {
        online: {
          online: false,
          mode: 1,
          last: time,
        },
      });
    }
  }

  handleConnection(client: Socket) {
    const timezone = momentstz()
      .tz('America/New_York')
      .utc()
      .format();

    const time = moments(timezone)
      .add(15, 'minutes')
      .toDate();

    if (client.handshake.query.online === 1) {
      this.server.emit(`USER:${client.handshake.query.USER}:ONLINE`, { online: true });
      /*this.logger.log(
        `User ${client.handshake.query.user} has been logged in with session ID ${client.handshake.query.session} and with Socket Id ${client.id}.`,
      );*/
      return this.userService.updateOnlineUser(client.handshake.query.user, {
        online: {
          online: true,
          mode: 1,
          last: time,
        },
      });
    }
  }

  /*@SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }*/
}
