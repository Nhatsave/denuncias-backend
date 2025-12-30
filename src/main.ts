// src/main.ts
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express'; // ← Importe isto
import { AppModule } from './app.module';
import { join } from 'path';

async function bootstrap() {
  const logger = new Logger('Bootstrap');
  
  // Use NestExpressApplication como tipo genérico
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    cors: {
      origin: '*',
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      allowedHeaders: 'Content-Type, Authorization, X-Requested-With, Accept',
      credentials: false,
    },
  });

  // Configuração para servir arquivos estáticos
  const uploadsPath = join(__dirname, '..', 'uploads');
  app.useStaticAssets(uploadsPath, {
    prefix: '/uploads/',
    index: false,
    redirect: false,
  });

  // Pipe de validação global
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
    transformOptions: {
      enableImplicitConversion: true,
    },
  }));

  // Inicia o servidor
  const port = process.env.PORT || 3000;
  const host = '0.0.0.0';
  
  await app.listen(port, host);

  console.log('DB_USER:', process.env.DB_USER);
console.log('DB_PASS:', process.env.DB_PASS);
console.log('DB_NAME:', process.env.DB_NAME);
  
  logger.log(`=========================================`);
  logger.log(`🚀 Servidor rodando em: http://${host}:${port}`);
  logger.log(`📁 Uploads disponíveis em: http://${host}:${port}/uploads/`);
  logger.log(`=========================================`);
}

bootstrap();