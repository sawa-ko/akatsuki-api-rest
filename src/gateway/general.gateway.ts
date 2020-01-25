import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import * as moments from 'moment';
import * as momentstz from 'moment-timezone';
import { Socket, Server } from 'socket.io';
import { InjectModel } from 'nestjs-typegoose';
import { UserModel } from '../modules/user/models/user.model';
import { ReturnModelType } from '@typegoose/typegoose';

@WebSocketGateway()
export class GeneralGateway
  implements OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit {
  @WebSocketServer() private readonly server: any;
  private readonly logger: Logger = new Logger('Gateway: General');

  constructor(
    @InjectModel(UserModel)
    private readonly userModel: ReturnModelType<typeof UserModel>,
  ) {}

  afterInit() {
    this.logger.log('Initialize gateway.');
  }

  handleDisconnect(client: Socket) {
    const timezone = momentstz()
      .tz('America/New_York')
      .utc()
      .format();

    const time = moments(timezone).toDate();

    if (client.handshake.query.online === '1') {
      this.server.emit(`USER:${client.handshake.query.USER}:ONLINE`, {
        online: false,
      });

      this.logger.log(
        `User ${client.handshake.query.user} with session ID ${client.handshake.query.session} and with Socket Id ${client.id} has been disconnected.`,
      );

      return this.userModel.findByIdAndUpdate(client.handshake.query.user, {
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

    const time = moments(timezone).toDate();

    if (client.handshake.query.online === '1') {
      this.server.emit(`USER:${client.handshake.query.USER}:ONLINE`, {
        online: true,
      });

      this.logger.log(
        `User ${client.handshake.query.user} has been logged in with session ID ${client.handshake.query.session} and with Socket Id ${client.id}.`,
      );

      return this.userModel.findByIdAndUpdate(client.handshake.query.user, {
        online: {
          online: true,
          mode: 1,
          last: time,
        },
      });
    }
  }
}
