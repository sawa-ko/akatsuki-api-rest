import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  MessageBody,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway()
export class MarketGateway implements OnGatewayInit {
  @WebSocketServer() private readonly server: any;
  private readonly logger: Logger = new Logger('Gateway: Market');

  afterInit() {
    this.logger.log('Initialize gateway.');
  }

  @SubscribeMessage('MARKET:COMMENT')
  newCommentMarket(@MessageBody() data: any) {
    return this.server.emit('MARKET:COMMENT', data);
  }

  @SubscribeMessage('MARKET:PURCHASE')
  newPurchaseMarket(@MessageBody() data: any) {
    return this.server.emit('MARKET:PURCHASE', data);
  }
}
