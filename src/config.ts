
// mppm.json
/**
 * packages, default is ["packages/*"]
 * version default is indenpendent
 */
import { existsSync, readFileSync } from 'fs';
import * as glob from 'glob';
import { resolve } from 'path';

const configFilePath = resolve('./', 'mppm.json');
export const enum versionAssociation {
  indenpendent = 'independent',
  consistent = 'consistent',
}

const defaultConfig = {
  packages: ['packages/*'],
  publishBranch: 'origin/master',
  commitBranch: 'origin/master',
};

// fixedConfig include some features which will be supported in future
const fixedConfig = {
  // todo: support the feature all packages version are "consistent"
  versionAssociation: versionAssociation.indenpendent,
};

const getConfig = () => {
  let userConfig = {};
  if (existsSync(configFilePath)) {
    const configContent = readFileSync(configFilePath);
    userConfig = JSON.parse(configContent.toString());
  }
  return {...defaultConfig, ...userConfig, ...fixedConfig};
};

const packagesPattern = getConfig().packages;

const packageFolders: string[] = [];
packagesPattern.forEach(pattern => {
  const folders = glob.sync(pattern);
  packageFolders.push(...folders);
});

export const packageNames: string[] = [];
export const packageMaps: IPackageMap[] = packageFolders.map(folder => {
  const packageJsonFile = resolve(folder, 'package.json');
  const packageJsonContent = readFileSync(packageJsonFile);
  const packageJsonObj: IPackageJsonObj = JSON.parse(packageJsonContent.toString());

  packageNames.push(packageJsonObj.name);
  return {
    name: packageJsonObj.name,
    packageJsonObj,
    path: resolve(folder),
  }
});
