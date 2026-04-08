import * as migration_20260408_163646 from './20260408_163646';
import * as migration_20260408_230229 from './20260408_230229';

export const migrations = [
  {
    up: migration_20260408_163646.up,
    down: migration_20260408_163646.down,
    name: '20260408_163646',
  },
  {
    up: migration_20260408_230229.up,
    down: migration_20260408_230229.down,
    name: '20260408_230229'
  },
];
