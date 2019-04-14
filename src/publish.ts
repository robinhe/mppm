import { changedPackages } from './changed';

console.log(changedPackages);

/**
 * 1. check current publish branch config
 * 2. get version step config
 * 3. change version, change linked version(would not change to alpha/beta version)
 * 4. generate changelog
 * 5. get message config, commit to branch
 * 6. publish
 * 7. commit to commitBranch
 */
