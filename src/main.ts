import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/fillters/http-exception.fillter';
import { ValidationExceptionFilter } from './common/fillters/validation-exception.fillter';

async function bootstrap() {

  const app = await NestFactory.create(AppModule);
  //Exception-Pipe
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ValidationExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors()

  //Swagger
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('WEBSITE MYHUFIER : SERVER NEXT JS')
    .setDescription('The Myhufier API CRUD api')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(process.env.PORT);

  console.log(`
  ============================================

  API Server is running on: ${await app.getUrl()}/api-docs

  ============================================
  `);
}
bootstrap();
