import { connectionSource } from './ormconfig';
import { runSeeders } from 'typeorm-extension';

async function seed() {
  await connectionSource.initialize();
  await runSeeders(connectionSource);
  await connectionSource.destroy();
}

seed();
