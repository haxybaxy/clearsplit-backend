import { DataSource } from 'typeorm';
import { dbConfig } from './db.config';

export const connectionSource = new DataSource(dbConfig.getTypeOrmCliConfig());
