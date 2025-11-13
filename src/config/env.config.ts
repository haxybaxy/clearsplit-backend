import * as dotenv from 'dotenv';
import { ConfigService } from '@nestjs/config';

function loadEnv() {
  const environment = process.env.NODE_ENV
    ? process.env.NODE_ENV.toLowerCase()
    : 'development';
  switch (environment) {
    case 'test': {
      dotenv.config({ path: '.env.test' });
      return;
    }
    case 'test_ci': {
      dotenv.config({ path: '.env.test_ci' });
      return;
    }
    case 'development': {
      dotenv.config();
      return;
    }
    default:
      return;
  }
}

loadEnv();
export const envConfig = new ConfigService({
  ...process.env,
});
