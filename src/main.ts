import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  //Swagger
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle('Payment Gateway Posting API')
    .setDescription('The Payment API CRUD api')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3004);

  console.log(`
  ============================================

  API Server is running on: ${await app.getUrl()}/api-docs

  ============================================
  `);
}
bootstrap();
