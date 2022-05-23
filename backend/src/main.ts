import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

import { AppModule } from './app.module';
import { ValidationPipe } from './shared/validation.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('PORT');

  app.enableCors();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(port);

  Logger.log(`Server is running on port ${port}`, 'Boot');
}
bootstrap();
