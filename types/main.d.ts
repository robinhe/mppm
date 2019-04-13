interface IDependencyObj {
  name: string;
  version: string;
}
interface IDependency {
  [key: string]: string;
}

interface IPackageJsonObj {
  name: string;
  version: string;
  dependencies: IDependency;
  devDependencies: IDependency;
}