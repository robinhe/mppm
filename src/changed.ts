import { execSync } from 'child_process';
import * as glob from 'glob';
import { resolve } from 'path';

import { packageMaps } from './config';

const changedFiles = execSync('git diff --name-only HEAD HEAD~1').toString().split('\n');
// const commitIds = execSync('git rev-list HEAD').toString().split('\n');
// const commitDiff = execSync(`git diff ${commitIds[1]} ${commitIds[0]} ${packageJsonPath}`).toString();
const changedFilePaths = changedFiles.filter(file => !!file).map(file => resolve(file));

export const changedPackages: IChangedPackage[] = [];

const getPackagesLinkSpecifiedPackage = (packageName: string, packageMapsCopy: IPackageMap[]) => {
  const packagesLinkThePackage: IPackageInfo[] = [];
  packageMapsCopy.forEach(({ name, path, packageJsonObj: { dependencies, devDependencies }}) => {
    const depends = {...devDependencies || {}, ...dependencies || {}};
    if (Object.keys(depends).includes(packageName)) {
      packagesLinkThePackage.push({ name, path });
    }
  });
  return packagesLinkThePackage;
};

packageMaps.forEach(({ name, path, packageJsonObj }) => {
  if (changedFilePaths.find(filePath => filePath.includes(path))) {
    changedPackages.push({
      name,
      version: packageJsonObj.version,
      packagesLinkThePackage: getPackagesLinkSpecifiedPackage(name, packageMaps),
    });
  }
});

console.log(`changedPackages ${changedPackages}`);
