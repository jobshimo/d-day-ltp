/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';

async function bootstrap() {
  // Fail fast: JWT_SECRET is mandatory in production
  if (process.env['NODE_ENV'] === 'production' && !process.env['JWT_SECRET']) {
    throw new Error(
      'JWT_SECRET env var is required in production. Set it before starting the server.',
    );
  }

  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  // NO enableCors() — Angular is served same-origin via ServeStaticModule (Slice E)
  const port = process.env['PORT'] || 3000;
  await app.listen(port);
  Logger.log(
    `Application is running on: http://localhost:${port}/${globalPrefix}`,
  );
}

bootstrap();
