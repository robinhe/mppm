
// mppm.json
/**
 * packages, default is ["packages/*"]
 * version default is indenpendent
 */
import { existsSync, readFileSync } from 'fs';
import * as glob from 'glob';
import { resolve } from 'path';

const configFilePath = resolve('./', 'mppm.config.js');
export const enum versionAssociation {
  indenpendent = 'independent',
  consistent = 'consistent',
}
enum versionStepEnum {
  patch = 'patch',
  minor = 'minor',
  major = 'major',
  premajor = 'premajor',
  preminor = 'preminor',
  prepatch = 'prepatch',
  prerelease = 'prerelease',
}

const defaultConfig = {
  packages: ['packages/*'],
  publishBranch: 'origin/master',
  publishRegistry: 'https://registry.npmjs.org/',
  publishBlacklist: [], // todo: remove this
  shouldPublishWhenDependencyPublished: true, // todo: remove this
  commitMessage: 'Packages published',
  versionStep: versionStepEnum.patch,
  versionPreid: 'alpha',
};

// fixedConfig include some features which will be supported in future
const fixedConfig = {
  // todo: support the feature all packages version are "consistent"
  versionAssociation: versionAssociation.indenpendent,
};

export const getConfig = (): IConfig => {
  let userConfig = {};
  if (existsSync(configFilePath)) {
    userConfig = require(configFilePath);
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
    version: packageJsonObj.version,
  };
});
