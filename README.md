<p align="left">
  <a href="https://travis-ci.org/helongbin/mppm">
    <img alt="Travis Status" src="https://img.shields.io/travis/helongbin/mppm/master.svg?style=flat&label=travis">
  </a>
  <a href="https://www.npmjs.com/package/mppm">
    <img alt="NPM version" src="https://img.shields.io/npm/v/mppm">
  </a>
</p>


* [Usage](#Usage)
* [Config](#Config)
* [Command](#command)
  * [bootsrap](#bootsrap)
  * [publish](#publish)

------
It is similiar with [lerna](https://github.com/lerna/lerna).
But lerna is a little complicated.

## Usage

Project structure can be below  
```
mppm-repo/
  package.json
  mppm.config.js
  packages/
    package-1/
      package.json
    package-2/
      package.json
```
Get started
```
npm install -D mppm
```

## Config
Initialize mppm config with `mppm.config.js` in root folder.  

eg:
```
module.exports = {
  packages: ['packages/*'],
  versionUpgradeStep: 'patch',
  publishRegistry: 'https://registry.npmjs.org/'
}
```
Above config arguments can be set:
1. packages  
Default value is `['packages/*']`
2. versionUpgradeStep  
Currently it only supports `patch`
4. commitBranch  
Specified branch to be committed
5. commitMessage  
Specified message to be committed
6. publishRegistry  
Your registry to publish, default is `https://registry.npmjs.org/`
7. shouldPublishWhenDependencyPublished  
Whether the package should be also published when its dependency (a package exists in your project) is published
8. publishBlacklist  
Specify which packages could not be published whatever

## Command
### bootsrap
```
npx mppm bootstrap
``` 
It will install dependencies and devDependencies for each package.  
If there are dependencies between packages, they will be linked each other. 

### publish
```
npx mppm publish
```
Publish changed packages and packages which link changed packages.
