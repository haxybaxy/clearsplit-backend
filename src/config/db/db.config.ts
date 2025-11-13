import { DataSourceOptions } from 'typeorm';

import { ConfigService } from '@nestjs/config';
import { SeederOptions } from 'typeorm-extension';
import { envConfig } from '../env.config';

export class DbConfig {
  private readonly defaultConfig: DataSourceOptions;

  constructor(private readonly config: ConfigService) {
    this.defaultConfig = {
      type: 'postgres',
      username: this.config.get('DATABASE_USER'),
      password: this.config.get('DATABASE_PASSWORD'),
      host: this.config.get('DATABASE_HOST'),
      port: this.config.get('DATABASE_PORT'),
      database: this.config.get('DATABASE_NAME'),
      synchronize: false,
      ssl: this.getSSLConfig(),
      logging: this.loggingEnabled() === 'true',
    };
  }

  private getSSLConfig() {
    if (this.isDevelopment()) return false;

    return { rejectUnauthorized: false };
  }

  private loggingEnabled() {
    return this.config.get<string>('DATABASE_LOGGING_ENABLED');
  }

  private isDevelopment() {
    return this.config.get('NODE_ENV') === 'development';
  }

  getTypeOrmConfig() {
    return { ...this.defaultConfig, autoLoadEntities: true };
  }

  getTypeOrmCliConfig(): DataSourceOptions & SeederOptions {
    return {
      ...this.defaultConfig,
      migrationsTableName: 'migration',
      migrations: ['dist/modules/**/infra/repositories/migrations/*.js'],
      entities: ['dist/modules/**/model/*.entity.js'],
      seeds: ['dist/modules/**/infra/repositories/seeds/*.js'],
    };
  }
}

export const dbConfig = new DbConfig(envConfig);
