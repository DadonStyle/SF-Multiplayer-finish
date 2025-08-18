import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { IoAdapter } from '@nestjs/platform-socket.io';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  app.useWebSocketAdapter(new IoAdapter(app));

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin:
      process.env.NODE_ENV === 'production' ? ['https://domain.com'] : true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  const config = new DocumentBuilder()
    .setTitle('Multiplayer Game API')
    .setDescription('Real-time multiplayer game backend with Socket.IO')
    .setVersion('1.0')
    .addTag('game')
    .addTag('leaderboard')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  const port = configService.get('APP_PORT') || 3000;
  const ip = configService.get('IP') || 'localhost';

  await app.listen(port);
  logger.log(`Application is running on: http://${ip}:${port}`);
  logger.log(`API Documentation: http://${ip}:${port}/api`);
  logger.log(`Game WebSocket: ws://${ip}:${port}/game`);

  setInterval(() => {
    logger.debug(`App is running ${ip}:${port}`);
  }, 30_000);
}
bootstrap();
