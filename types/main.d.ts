interface IDependencyObj {
  name: string;
  version: string;
}
interface IDependency {
  [key: string]: string;
}

interface IPackageInfo {
  name: string;
  path: string;
  version: string;
}
interface IPackageJsonObj {
  name: string;
  version: string;
  dependencies: IDependency;
  devDependencies: IDependency;
}

interface IChangedPackage extends IDependencyObj {
  packagesLinkThePackage: IPackageInfo[];
}

interface IPackageMap extends IPackageInfo {
  packageJsonObj: IPackageJsonObj;
}

interface IConfig {
  packages: string[];
  publishBranch: string;
  publishRegistry: string;
  publishBlacklist: string[];
  shouldPublishWhenDependencyPublished: boolean;
  commitBranch?: string;
  commitMessage?: string;
  versionStep: string;
  versionPreid: string;
}

interface IPublishedPackage {
  name: string;
  previousVersion: string;
  newVersion: string;
}