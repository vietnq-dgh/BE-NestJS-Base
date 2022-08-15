import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/fillters/http-exception.fillter';
import { ValidationExceptionFilter } from './common/fillters/validation-exception.fillter';
import * as cookieParser from 'cookie-parser';
import { PublicModules } from './common/PublicModules';
import * as loggerMorgan from 'morgan';

const APP_NAME = process.env.APP_NAME;

async function bootstrap() {
  let app = null;
  if (String(process.env.HTTPS).toUpperCase() === 'TRUE') {
    const fs = require('fs');
    const keyFile = fs.readFileSync(__dirname + '/../ssls/' + String(process.env.SSL_KEY_FILE));
    const certFile = fs.readFileSync(__dirname + '/../ssls/' + String(process.env.SSL_CRT_FILE));

    app = await NestFactory.create(AppModule, {
      httpsOptions: {
        key: keyFile,
        cert: certFile,
      }
    });
  } else {
    app = await NestFactory.create(AppModule);
  }
  //Exception-Pipe
  app.useGlobalFilters(new HttpExceptionFilter());
  app.useGlobalFilters(new ValidationExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  // cors
  var whitelist = process.env.DOMAIN_ALLOW;
  app.enableCors({
    origin: function (origin: any, callback: Function) {
      if (whitelist.indexOf(origin) !== -1) {
        console.info("=> Allowed cors for:", origin);
        callback(null, true);
      } else {
        if (origin)
          console.error("=> Blocked cors for:", origin);
        callback(null, false);
      }
    },
    allowedHeaders: "Authorization, Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers",
    methods: "GET,PUT,POST,DELETE,UPDATE,OPTIONS,HEAD,PATCH",
    credentials: true,
  });

  app.use(cookieParser());
  app.use(loggerMorgan('dev'));

  //Swagger
  const swaggerConfig = new DocumentBuilder()
    .addBearerAuth()
    .setTitle(`SERVICE NEST JS: ${APP_NAME}`)
    .setDescription(`SERVICE ${APP_NAME} API CRUD`)
    .setVersion('1.0')
    .build();

  const swagger_router_text = `[be ${APP_NAME} @API Server is running on]`;
  const swagger_router_hash = PublicModules.fun_encryptMD5(swagger_router_text);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(`api-docs/${swagger_router_hash}`, app, document);

  await app.listen(process.env.PORT);

  console.log(`
  ============================================

  API Server is running on: ${await app.getUrl()}/api-docs/${swagger_router_hash}

  ============================================
  `);
}
bootstrap();
