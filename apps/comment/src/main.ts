import { NestFactory } from '@nestjs/core';
import { CommentModule } from './comment.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';


async function bootstrap() {
  const app = await NestFactory.create(CommentModule);
  app.enableCors();
  app.use(helmet());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
  }));

  const config = new DocumentBuilder()
  .setTitle('Post Service')
  .setDescription('API documentation for the post service')
  .setVersion('1.0')
  .addBearerAuth()
  .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);
  await app.listen(3002);
}
bootstrap();
