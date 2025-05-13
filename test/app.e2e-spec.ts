import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import helmet from 'helmet';

describe('TransactionsController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.use(helmet());
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/transactions (POST) - deve aceitar uma transação válida', async () => {
    const res = await request(app.getHttpServer())
      .post('/transactions')
      .send({ amount: 123.45, timestamp: new Date().toISOString() });

    expect(res.status).toBe(201);
  });

  it('/transactions (POST) - deve recusar timestamp no futuro', async () => {
    const future = new Date(Date.now() + 60000);
    const res = await request(app.getHttpServer())
      .post('/transactions')
      .send({ amount: 10, timestamp: future.toISOString() });

    expect(res.status).toBe(422);
  });

  it('/transactions (POST) - deve recusar JSON inválido', async () => {
    const res = await request(app.getHttpServer())
      .post('/transactions')
      .send({ valor: 100 }); // campo errado

    expect(res.status).toBe(400);
  });

  it('/statistics (GET) - deve retornar estatísticas', async () => {
    const res = await request(app.getHttpServer()).get(
      '/transactions/statistics',
    );

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('count');
    expect(res.body).toHaveProperty('sum');
    expect(res.body).toHaveProperty('avg');
    expect(res.body).toHaveProperty('min');
    expect(res.body).toHaveProperty('max');
  });

  it('/transactions (DELETE) - deve limpar todas as transações', async () => {
    const res = await request(app.getHttpServer()).delete('/transactions');
    expect(res.status).toBe(200);
  });

  it('/health (GET) - deve retornar ok', async () => {
    const res = await request(app.getHttpServer()).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});
