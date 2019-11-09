import { packageMaps } from '../config';
import { executeSpawn } from '../utils/execute';

/**
 * 1. get argv command
 * 2. execute command sync one by one
 */
const argvs = process.argv.slice(2);
const command = argvs[0].replace(/run\s/, ''); // eg: 'run dist'.replace()

const packageMapList = [...packageMaps];
const execute = () => {
  const packageMapItem = packageMapList.shift();
  if (packageMapItem) {
    executeSpawn(
      'npm',
      ['run', `${command}`],
      { cwd: packageMapItem.path },
      execute,
    );
  } else {
    process.exit(0);
  }
};

execute();
