
import { execSync } from 'child_process';
import { readFileSync } from 'fs';
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
  const { name, dependencies, devDependencies } = JSON.parse(packageJsonContent.toString());

  packageNames.push(name);
  return {
    cwd: resolve(folder),
    dependencies,
    devDependencies,
    name,
  }
});

// console.log(packageMaps);

packageMaps.forEach(({ name, cwd, dependencies, devDependencies }) => {
  /* const depends = {...devDependencies || {}, ...dependencies || {}};
  // todo: need it check whether the versions are consitent before symlink internal packages?
  const symlinkedPackageNames = Object.keys(depends)
    .filter(packageName => packageNames.includes(packageName));
  console.log(symlinkedPackageNames);
  symlinkedPackageNames.forEach(symlinkedPackageName => {
    const symlinkedPackage =
      packageMaps.find(packageMap => packageMap.name === symlinkedPackageName);
    const symlinkedPackagePath = symlinkedPackage!.cwd;
    execSync(`npm link ${symlinkedPackagePath}`, { cwd });
  }); */

  execSync('npm i', { cwd })
});
