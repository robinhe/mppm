
// mppm.json
/**
 * packages, default is ["packages/*"]
 * version default is indenpendent
 */
import * as fs from 'fs';
import * as path from 'path';

const configFilePath = path.resolve('./', 'mppm.json');

const defaultConfig = {
  packages: ['packages/*'],
};

// fixedConfig include some features which will be supported in future
const fixedConfig = {
  version: 'independent', // todo: support the feature all packages version should be "consistent"
};

export const getConfig = () => {
  let userConfig = {};
  if (fs.existsSync(configFilePath)) {
    const configContent = fs.readFileSync(configFilePath);
    userConfig = JSON.parse(configContent.toString());
  }
  return {...defaultConfig, ...userConfig, ...fixedConfig};
};
