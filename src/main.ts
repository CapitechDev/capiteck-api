import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('CapiTech API')
    .setDescription(
      `
      Documentação da API do projeto CapiTech
      
      ## Autenticação
      A API utiliza JWT (JSON Web Tokens) para autenticação. Após fazer login, inclua o token no header:
      \`Authorization: Bearer <seu-token>\`
      
      ## Tipos de Usuário
      - **ADMIN**: Acesso completo ao sistema (web e mobile)
      - **USER**: Acesso restrito ao mobile
      
      ## Permissões
      - Alguns endpoints são públicos (registro, login, recuperação de senha)
      - Endpoints marcados com 🔒 requerem autenticação
      - Endpoints marcados com 👑 são exclusivos para administradores
      - Endpoints marcados com 📱 são exclusivos para usuários mobile
    `,
    )
    .setVersion('1.0')
    .setContact('CapiTech Team', 'https://capitech.com', 'contato@capitech.com')
    .addBearerAuth({
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      name: 'JWT',
      description: 'Token JWT obtido após login',
      in: 'header',
    })
    .addTag(
      'Autenticação',
      'Endpoints para login, perfil e recuperação de senha',
    )
    .addTag('Usuários', 'Gerenciamento de usuários do sistema')
    .addTag('Trilhas', 'Gerenciamento de trilhas de aprendizado')
    .build();
  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory);

  await app.listen(4000);
}
bootstrap();
