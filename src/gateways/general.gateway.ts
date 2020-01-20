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

@WebSocketGateway()
export class GeneralGateway
  implements OnGatewayConnection, OnGatewayDisconnect {
  private readonly logger: Logger = new Logger('Gateway: General');

  @WebSocketServer() private readonly server: any;
  constructor(private readonly userService: UserService) {}

  handleDisconnect(client: any) {
    const timezone = momentstz()
      .tz('America/New_York')
      .utc()
      .format();

    const time = moments(timezone)
      .add(15, 'minutes')
      .toDate();

    if (client.query.online === 1) {
      this.server.emit(`USER:${client.query.USER}:ONLINE`, { online: false });
      this.logger.log(
        `User ${client.query.user} with session ID ${client.query.session} and with Socket Id ${client.id} has been disconnected.`,
      );
      return this.userService.updateOnlineUser(client.query.user, {
        online: {
          online: false,
          mode: 1,
          last: time,
        },
      });
    }
  }

  handleConnection(client: any) {
    const timezone = momentstz()
      .tz('America/New_York')
      .utc()
      .format();

    const time = moments(timezone)
      .add(15, 'minutes')
      .toDate();

    if (client.query.online === 1) {
      this.server.emit(`USER:${client.query.USER}:ONLINE`, { online: true });
      this.logger.log(
        `User ${client.query.user} has been logged in with session ID ${client.query.session} and with Socket Id ${client.id}.`,
      );
      return this.userService.updateOnlineUser(client.query.user, {
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
