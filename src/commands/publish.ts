import { join } from 'path';
import { readFileSync, writeFileSync } from 'fs';
import { execSync } from 'child_process';

import { changedPackages } from './changed';
import { getConfig, packageMaps } from '../config';
import { logError, logSuccess } from '../utils/log';

/**
 * 1. check current publish branch config
 * 2. get version step config
 * 3. change version, change linked version(would not change to alpha/beta version)
 * 4. generate changelog
 * 5. get message config, commit to branch
 * 6. publish
 * 7. commit to commitBranch
 */

const config = getConfig();
const publishedPackages: IPublishedPackage[] = [];

const changePackageVersion = (pkgPath: string) => {
  return execSync(`npm version ${config.versionStep} --preid=${config.versionPreid}`, { cwd: pkgPath })
  .toString().trim().slice(1);
};

const changePackageDependencyVersion = (pkgPath: string, dependencyName: string, dependencyVersion: string) => {
  const packageJsonFile = join(pkgPath, '/package.json');
  const reg = new RegExp(`("${dependencyName}": ")(.*?)"`);
  const newJsonString = readFileSync(packageJsonFile).toString()
    .replace(reg, (match, $1, $2) => `${$1}${dependencyVersion}"`);
  writeFileSync(packageJsonFile, newJsonString);
};

const publishPackage = (path: string) => {
  const tag = ['patch', 'minor', 'major'].includes(config.versionStep) ? 'latest' : 'beta';
  execSync(`npm publish --tag ${tag} --registry ${config.publishRegistry}`, { cwd: path });
};

const execPublish = () => {
  /**
   * loop changed packages
   * get package.json, change the version by step
   * loop packageMaps, also change packages version which depends on the package
   */
  changedPackages.forEach(({ name, version, packagesLinkThePackage }) => {
    // prevent publishing when the package is in the blacklist
    if (config.publishBlacklist.includes(name)) { return ; }

    const pkg = packageMaps.find(pkg => pkg.name === name);
    const newVersion = changePackageVersion(pkg!.path);
    publishPackage(pkg!.path);
    publishedPackages.push({ name, previousVersion: version, newVersion });

    if (!config.shouldPublishWhenDependencyPublished) { return ; }

    packagesLinkThePackage.forEach(({ path: linkedPkgPath, version: linkedPkgVersion, name: linkedPkgName }) => {
      if (config.publishBlacklist.includes(linkedPkgName)) {
        // prevent publishing when the package is in the blacklist
      } else {
        changePackageDependencyVersion(linkedPkgPath, name, newVersion);
        if (changedPackages.find(pkg => pkg.name === linkedPkgName)) {
          // do nothing when the package has exist in changed packages
        } else {
          const newVersion = changePackageVersion(linkedPkgPath);
          publishPackage(linkedPkgPath);
          publishedPackages.push({ name, previousVersion: version, newVersion });
        }
      }
    });
  });

  const publishedPackagesInfo = publishedPackages
    .map(item => `${item.name} ${item.previousVersion} => ${item.newVersion}`)
    .join('\n');
  logSuccess('publish packages successfully: ', `\n${publishedPackagesInfo}`);
};

const commitMessage = (commitBranch: string) => {
  /**
   * read message config
   * commit with specified message
   * git commit to commit branch
   */
  const commitDetails = publishedPackages.map(item => ` -m "- ${item.name}@${item.newVersion}"`).join('');
  execSync('git add .');
  execSync(`git commit -m "${config.commitMessage}" ${commitDetails}`);
  publishedPackages.forEach(({ name, newVersion }) => {
    execSync(`git tag ${name}@${newVersion}`);
  });
  execSync(`git push origin HEAD:${commitBranch.replace(/origin\//, '')} --tags`);
};

execPublish();
if (config.commitBranch) { commitMessage(config.commitBranch); }
