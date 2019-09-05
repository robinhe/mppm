#!/usr/bin/env node
import { execSync } from 'child_process';
import { resolve } from 'path';
import { logError, logNormal, logInfo } from './helpers';

const changed = () => {
  const file = resolve(__dirname, './changed');
  logNormal(execSync(`node ${file}`).toString());
};

const bootstrap = () => {
  logInfo('mppm info: ', 'will execute "bootstrap"');
  const file = resolve(__dirname, './bootstrap');
  logNormal(execSync(`node ${file}`).toString());
  logInfo('mppm info: ', 'execute "bootstrap" successfully');
};

const publish = () => {
  logInfo(`mppm info: `, `will publish packages`);
  const file = resolve(__dirname, './publish');
  logNormal(execSync(`node ${file}`).toString());
};

const run = (mppmArgvs: string[]) => {
  logInfo(`mppm info: `, `will execute "npm run ${mppmArgvs[1]}" for each package`);
  const file = resolve(__dirname, './run');
  const argvs = mppmArgvs.join(' ')
  logNormal(execSync(`node ${file} ${argvs}`).toString());
  logInfo(`mppm info: `, `execute "npm run ${mppmArgvs[1]}" successfully`);
};

const mppmArgvs = process.argv.slice(2);

switch (mppmArgvs[0]) {
  case 'changed': changed(); break;
  case 'bootstrap': bootstrap(); break;
  case 'publish': publish(); break;
  case 'run': run(mppmArgvs); break;
  default: logError('mppm error: ', 'argv is invalid'); execSync('exit 1'); break;
}
