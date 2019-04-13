import { execSync } from 'child_process';
import { resolve } from 'path';

const bootstrapFile = resolve('./bootstrap');
execSync(`node ${bootstrapFile}`);

console .log(process.argv)