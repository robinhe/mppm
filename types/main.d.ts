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