import * as migration_20260409_045012 from './20260409_045012';
import * as migration_20260410_202257_add_commerce_phase3 from './20260410_202257_add_commerce_phase3';

export const migrations = [
  {
    up: migration_20260409_045012.up,
    down: migration_20260409_045012.down,
    name: '20260409_045012',
  },
  {
    up: migration_20260410_202257_add_commerce_phase3.up,
    down: migration_20260410_202257_add_commerce_phase3.down,
    name: '20260410_202257_add_commerce_phase3'
  },
];
