#!/usr/bin/env node
import { execSync } from 'child_process';
import { resolve } from 'path';
import { logError, logInfo } from './helpers';

const changed = () => {
  const file = resolve(__dirname, './changed');
  console.log(execSync(`node ${file}`).toString());
};

const bootstrap = () => {
  const file = resolve(__dirname, './bootstrap');
  console.log(execSync(`node ${file}`).toString());
};

const publish = () => {
  const file = resolve(__dirname, './publish');
  console.log(execSync(`node ${file}`).toString());
};

const run = (mppmArgvs: string[]) => {
  const file = resolve(__dirname, './run');
  const argvs = mppmArgvs.join(' ')
  console.log(execSync(`node ${file} ${argvs}`).toString());
};

const mppmArgvs = process.argv.slice(2);

switch (mppmArgvs[0]) {
  case 'changed': changed(); break;
  case 'bootstrap': bootstrap(); break;
  case 'publish': publish(); break;
  case 'run': run(mppmArgvs); break;
  default: logError('argv is invalid'); break;
}
