
import { execSync } from 'child_process';
import { copyFileSync, readFileSync, writeFileSync, unlinkSync } from 'fs';
import { resolve } from 'path';

import { packageMaps, packageNames } from '../config';
import { logNormal } from '../utils/log';

packageMaps.forEach(({ name, path, packageJsonObj }) => {
  logNormal(`cwd: ${path}`);

  const installedDevDependencies: IDependencyObj[] = [];
  const installedDependencies: IDependencyObj[] = [];
  const linkedDevDependencies: IDependencyObj[] = [];
  const linkedDependencies: IDependencyObj[] = [];

  Object.entries(packageJsonObj.dependencies || []).forEach(([dependency, version]) => {
    if (packageNames.includes(dependency)) {
      linkedDependencies.push({ name: dependency, version });
    } else {
      installedDependencies.push({ name: dependency, version });
    }
  });

  Object.entries(packageJsonObj.devDependencies || []).forEach(([devDependency, version]) => {
    if (packageNames.includes(devDependency)) {
      linkedDevDependencies.push({ name: devDependency, version });
    } else {
      installedDevDependencies.push({ name: devDependency, version });
    }
  });

  // generate backup for package.json
  const sourcePackageJsonFile = resolve(path, 'package.json');
  const destPackageJsonFile = resolve(path, 'package.json.backup');
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
  logNormal(execSync('npm i', { cwd: path }).toString());

  // put back link packages into package.json
  copyFileSync(destPackageJsonFile, sourcePackageJsonFile);
  unlinkSync(`${destPackageJsonFile}`);

  // link
  // todo: need it check whether the versions are consitent before link internal packages?
  const linkedPackages = [...linkedDevDependencies, ...linkedDependencies];
  linkedPackages.forEach(linkedPackage => {
    const linkedPackageMap =
      packageMaps.find(packageMap => packageMap.name === linkedPackage.name);
    const linkedPackagePath = linkedPackageMap!.path;
    execSync(`npm link ${linkedPackagePath}`, { cwd: path }).toString();
  });
});
