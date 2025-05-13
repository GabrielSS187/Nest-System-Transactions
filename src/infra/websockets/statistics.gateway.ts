import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: { origin: '*' } })
export class StatisticsGateway implements OnGatewayConnection {
  @WebSocketServer()
  server: Server;

  private clients = new Map<string, Socket>();

  handleConnection(socket: Socket) {
    const clientId =
      (socket.handshake.auth as Record<string, unknown>)?.['clientId'] ??
      (socket.handshake.query as Record<string, unknown>)?.['clientId'];

    if (typeof clientId !== 'string' || !clientId.trim()) {
      socket.disconnect(true);
      return;
    }

    this.clients.set(clientId, socket);
  }

  emitToClient(clientId: string, data: any) {
    const socket = this.clients.get(clientId);
    if (socket) {
      socket.emit('statistics', data);
    }
  }
}
