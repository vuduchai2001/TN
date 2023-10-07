import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import './env';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  NestApplicationOptions,
  UnprocessableEntityException,
  ValidationPipe,
} from '@nestjs/common';
import { ValidationError, useContainer } from 'class-validator';
import { HttpFilter } from './common/exception';
import { errFormat, filterError } from './common/util/filter-error';
import { json, urlencoded } from 'body-parser';

async function bootstrap() {
  const options: NestApplicationOptions = {};
  if (process.env.LOGSTACK_ENABLE === 'true') {
    options.logger = false;
  }

  const app = await NestFactory.create(AppModule, options);

  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  app.enableCors({
    origin: function (_origin, callback) {
      callback(null, true);
    },
  });

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new UnprocessableEntityException(errFormat('ValidationError', filterError(errors)));
      },
    }),
  );

  app.useGlobalFilters(new HttpFilter());

  const configService = app.get(ConfigService);

  if (configService.get<boolean>('app.isSwagger')) {
    const options = new DocumentBuilder()
      .setTitle('API backend')
      .setDescription('API Server')
      .setVersion('dev')
      .addBearerAuth()
      .build();
    const document = SwaggerModule.createDocument(app, options);
    SwaggerModule.setup('swagger', app, document);
  }

  const port = configService.get('app.port');

  await app.listen(port, () => {
    console.log('🚀 Start at port: ', port, '. Node version: ', process.version);
  });
}

bootstrap();
