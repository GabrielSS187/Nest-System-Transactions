import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: true,
  });

  app.set('trust proxy', true);
  app.setGlobalPrefix('api');

  app.useLogger(app.get(Logger));
  app.use(helmet());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Transactions API')
    .setDescription(
      'API para registro e estatísticas de transações.\n\n' +
        '### Socket.IO\n' +
        '**URL:** `http://<host>/`\n' +
        '**Evento emitido:** `statistics`\n' +
        '**Auth esperada:** `clientId` via `auth` ou `query` na conexão.\n\n' +
        'O valor de `clientId` pode ser qualquer coisa ex: `ws-user`.\n\n' +
        'Conecte-se via WebSocket para receber estatísticas personalizadas em tempo real.',
    )
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(3000);
}
bootstrap();
