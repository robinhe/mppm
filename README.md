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
Below config arguments can be set:
1. packages  
Default value is `['packages/*']`
2. versionUpgradeStep  
Currently it only supports `patch`
3. prepublishCommand  
Default is `dist`, it will always run `npm run dist` before publish each package
4. commitBranch  
Specified branch to be committed
5. commitMessage  
Specified message to be committed

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
