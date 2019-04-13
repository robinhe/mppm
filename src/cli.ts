#!/usr/bin/env node

import { execSync } from 'child_process';
import { resolve } from 'path';

const bootstrap = () => {
  const bootstrapFile = resolve(__dirname, './bootstrap');
  console.log(execSync(`node ${bootstrapFile}`).toString());
};

const mppmArgvs = process.argv.slice(2);

switch (mppmArgvs[0]) {
  case 'bootstrap': bootstrap(); break;
  default: console.log('argv is invalid'); break;
}
