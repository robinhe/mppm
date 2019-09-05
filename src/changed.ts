import { execSync } from 'child_process';
import * as glob from 'glob';
import { resolve } from 'path';

import { packageMaps } from './config';
import { logInfo } from './helpers';

const changedFiles = execSync('git diff --name-only HEAD HEAD~1').toString().split('\n');
// const commitIds = execSync('git rev-list HEAD').toString().split('\n');
// const commitDiff = execSync(`git diff ${commitIds[1]} ${commitIds[0]} ${packageJsonPath}`).toString();
const changedFilePaths = changedFiles.filter(file => !!file).map(file => resolve(file));

export const changedPackages: IChangedPackage[] = [];

const getPackagesLinkSpecifiedPackage = (packageName: string, packageMapsCopy: IPackageMap[]) => {
  const packagesLinkThePackage: IPackageInfo[] = [];
  packageMapsCopy.forEach(({ name, path, packageJsonObj: { dependencies, devDependencies, version }}) => {
    const depends = {...devDependencies || {}, ...dependencies || {}};
    if (Object.keys(depends).includes(packageName)) {
      packagesLinkThePackage.push({ name, path, version });
    }
  });
  return packagesLinkThePackage;
};

packageMaps.forEach(({ name, path, packageJsonObj }) => {
  // fixme: change package root folder would not be regarded as changed package
  if (changedFilePaths.find(filePath => filePath.includes(path))) {
    changedPackages.push({
      name,
      version: packageJsonObj.version,
      packagesLinkThePackage: getPackagesLinkSpecifiedPackage(name, packageMaps),
    });
  }
});
logInfo('mppm info: ', `changedPackages: ${changedPackages.map(item => item.name).join()}`);
