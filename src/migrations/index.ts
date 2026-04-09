import * as migration_20260409_045012 from './20260409_045012';

export const migrations = [
  {
    up: migration_20260409_045012.up,
    down: migration_20260409_045012.down,
    name: '20260409_045012'
  },
];
