import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // /api/endpointNAME

  await app.listen(AppModule.port, () => {
    console.log('api funcionando en el puerto', AppModule.port);
  });
}
bootstrap();
