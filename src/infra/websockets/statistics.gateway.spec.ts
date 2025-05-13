import { StatisticsGateway } from './statistics.gateway';

describe('StatisticsGateway', () => {
  let gateway: StatisticsGateway;

  beforeEach(() => {
    gateway = new StatisticsGateway();
  });

  it('deve emitir dados para o cliente correto', () => {
    const clientId = 'cliente1';
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const mockSocket = {
      emit: jest.fn(),
    } as any;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    (gateway as any).clients.set(clientId, mockSocket);

    const payload = { foo: 'bar' };

    // emite para o cliente
    gateway.emitToClient(clientId, payload);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    expect(mockSocket.emit).toHaveBeenCalledWith('statistics', payload);
  });

  it('não deve emitir se o cliente não estiver conectado', () => {
    const spy = jest.fn();

    // força o método para observar se algo é emitido
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    (gateway as any).server = { emit: spy };

    // tenta emitir para um cliente inexistente
    gateway.emitToClient('desconhecido', { teste: true });

    expect(spy).not.toHaveBeenCalled();
  });
});
