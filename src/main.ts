import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import compression from 'compression';
import 'reflect-metadata';
import { AppModule } from './app/app.module';
import { IS_PRODUCTION_MODE } from './common/constants/IS_PRODUCTION_MODE.const';
import { getHelmet } from './common/fixtures';

async function bootstrap() {
  const PORT = process.env.PORT ?? 3001;

  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors();

  const helmet = await getHelmet();

  app.use(
    helmet({ contentSecurityPolicy: IS_PRODUCTION_MODE ? undefined : false }),
  );

  app.use(compression());

  await app.listen(PORT);
}

bootstrap();
