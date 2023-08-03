import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import { AppModule } from './infrastructure/application/app.module';
import { IS_PRODUCTION_MODE_TOKEN } from './infrastructure/config/IS_PRODUCTION_MODE_TOKEN';
import { getHelmet } from './infrastructure/helpers/modules-fixtures';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3001;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  const helmet = await getHelmet();

  app.use(
    helmet({
      contentSecurityPolicy: IS_PRODUCTION_MODE_TOKEN ? undefined : false,
      crossOriginEmbedderPolicy: false,
    }),
  );

  app.use(compression());

  await app.listen(PORT);
}

bootstrap();
