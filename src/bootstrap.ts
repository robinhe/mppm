
import { execSync } from 'child_process';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import * as glob from 'glob';
import { resolve } from 'path';

import { getConfig } from './config';

const config = getConfig();

const packagesPattern = config.packages;
const packageFolders: string[] = [];
packagesPattern.forEach(pattern => {
  const folders = glob.sync(pattern);
  packageFolders.push(...folders);
});

// console.log(packageFolders);
const packageNames: string[] = [];
const packageMaps = packageFolders.map(folder => {
  const packageJsonFile = resolve(folder, 'package.json');
  const packageJsonContent = readFileSync(packageJsonFile);
  const packageJsonObj: IPackageJsonObj = JSON.parse(packageJsonContent.toString());

  packageNames.push(packageJsonObj.name);
  return {
    cwd: resolve(folder),
    name: packageJsonObj.name,
    packageJsonObj,
  }
});

// console.log(packageMaps);

packageMaps.forEach(({ name, cwd, packageJsonObj }) => {
  const installedDevDependencies: IDependencyObj[] = [];
  const installedDependencies: IDependencyObj[] = [];
  const linkedDevDependencies: IDependencyObj[] = [];
  const linkedDependencies: IDependencyObj[] = [];

  Object.entries(packageJsonObj.dependencies).forEach(([dependency, version]) => {
    if (packageNames.includes(dependency)) {
      linkedDependencies.push({ name: dependency, version });
    } else {
      installedDependencies.push({ name: dependency, version });
    }
  });

  Object.entries(packageJsonObj.devDependencies).forEach(([devDependency, version]) => {
    if (packageNames.includes(devDependency)) {
      linkedDevDependencies.push({ name: devDependency, version });
    } else {
      installedDevDependencies.push({ name: devDependency, version });
    }
  });

  // generate backup for package.json
  const sourcePackageJsonFile = resolve(cwd, 'package.json');
  const destPackageJsonFile = resolve(cwd, 'package.json.backup');
  copyFileSync(sourcePackageJsonFile, destPackageJsonFile);

  // remove link packages from package.json
  const devDependenciesWithoutLinkedPackages: IDependency = {};
  const dependenciesWithoutLinkedPackages: IDependency = {};
  installedDevDependencies.forEach(item => {
    devDependenciesWithoutLinkedPackages[item.name] = item.version;
  });
  installedDependencies.forEach(item => {
    dependenciesWithoutLinkedPackages[item.name] = item.version;
  })
  const packageJsonObjWithoutLinkedPackages = {
    ...packageJsonObj,
    dependencies: dependenciesWithoutLinkedPackages,
    devDependencies: devDependenciesWithoutLinkedPackages,
  };
  writeFileSync(sourcePackageJsonFile, JSON.stringify(packageJsonObjWithoutLinkedPackages, null, 2));

  // install
  console.log(execSync('npm i', { cwd }).toString());

  // put back link packages into package.json
  copyFileSync(destPackageJsonFile, sourcePackageJsonFile);
  execSync(`rm -fr ${destPackageJsonFile}`, { cwd });

  // link
  // todo: need it check whether the versions are consitent before link internal packages?
  const linkedPackages = [...linkedDevDependencies, ...linkedDependencies];
  // console.log(linkedPackages);
  linkedPackages.forEach(linkedPackage => {
    const linkedPackageMap =
      packageMaps.find(packageMap => packageMap.name === linkedPackage.name);
    const linkedPackagePath = linkedPackageMap!.cwd;
    execSync(`npm link ${linkedPackagePath}`, { cwd }).toString();
  });
});
