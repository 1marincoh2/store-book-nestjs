import { TypeOrmModule } from '@nestjs/typeorm';
import { Configuration } from 'src/config/config.key';
import { ConfigModule } from 'src/config/config.module';
import { ConfigService } from 'src/config/config.service';
import { ConnectionOptions } from 'typeorm';

export const databaseProviders = [
  TypeOrmModule.forRootAsync({
    imports: [ConfigModule],
    inject: [ConfigService],
    async useFactory(Config: ConfigService) {
      return {
        // ssl: true, //en caso conectar una base de tado en la nube
        type: 'postgres', //porque se va canoectar un bd postgres
        host: Config.get(Configuration.HOST),
        port: +Config.get(Configuration.PORTDB),
        username: Config.get(Configuration.USERNAME),
        password: Config.get(Configuration.PASSWORD),
        database: Config.get(Configuration.DATABASE),
        synchronize: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        migrations: [__dirname + '/migrations/*{.ts,.js}'],
      } as ConnectionOptions;
    },
  }),
];
