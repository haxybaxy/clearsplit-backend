import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Swagger/OpenAPI Configuration
  const config = new DocumentBuilder()
    .setTitle('ClearSplit API')
    .setDescription(
      'API for expense splitting, team management, and financial tracking. ' +
        'This API uses Supabase authentication with JWT bearer tokens.',
    )
    .setVersion('1.0.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Enter JWT token from signup/login response',
        in: 'header',
      },
      'JWT-auth', // This name will be used in @ApiBearerAuth() decorator
    )
    .addServer('http://localhost:3000', 'Local Development Server')
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Teams', 'Team and team membership management')
    .addTag('Transactions', 'Financial transaction management')
    .addTag('Properties', 'Property/asset management')
    .addTag('Reports', 'Financial reporting and analytics')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true, // Keep JWT token after page refresh
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  await app.listen(3000);
  console.log(`Application is running on: http://localhost:3000`);
  console.log(`Swagger documentation available at: http://localhost:3000/api/docs`);
}
void bootstrap();
