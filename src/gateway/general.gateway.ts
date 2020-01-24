import { SubscribeMessage, WebSocketGateway, OnGatewayConnection, OnGatewayDisconnect, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import * as moments from 'moment';
import * as momentstz from 'moment-timezone';
import { Socket } from 'socket.io';
import { UserService } from '../modules/user/user.service';

@WebSocketGateway()
export class GeneralGateway implements OnGatewayConnection, OnGatewayDisconnect {
	private readonly logger: Logger = new Logger('Gateway: General');
	private readonly userService: UserService;

	@WebSocketServer() private readonly server: any;

	handleDisconnect(client: Socket) {
		const timezone = momentstz()
			.tz('America/New_York')
			.utc()
			.format();

		const time = moments(timezone)
			.toDate();
		
		if (client.handshake.query.online === "1") {
			this.server.emit(`USER:${client.handshake.query.USER}:ONLINE`, { online: false });
			this.logger.log(
			  `User ${client.handshake.query.user} with session ID ${client.handshake.query.session} and with Socket Id ${client.id} has been disconnected.`,
			);
			/*this.userService.updateOnlineUser(client.handshake.query.user, {
				online: {
					online: false,
					mode: 1,
					last: time,
				},
			});*/
		}
	}

	handleConnection(client: Socket) {
		const timezone = momentstz()
			.tz('America/New_York')
			.utc()
			.format();

		const time = moments(timezone)
			.toDate();

		if (client.handshake.query.online === "1") {
			this.server.emit(`USER:${client.handshake.query.USER}:ONLINE`, { online: true });
			this.logger.log(
			  `User ${client.handshake.query.user} has been logged in with session ID ${client.handshake.query.session} and with Socket Id ${client.id}.`,
			);
			/*return this.userService.updateOnlineUser(client.handshake.query.user, {
				online: {
					online: true,
					mode: 1,
					last: time,
				},
			});*/
		}
	}
}
