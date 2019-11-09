import { spawn, SpawnOptionsWithoutStdio } from 'child_process';

export const executeSpawn = (
  command: string,
  spawnArgvs?: string[],
  spawnOptions?: SpawnOptionsWithoutStdio,
  callback?: () => any,
) => {
  const child = spawn(command, spawnArgvs, spawnOptions);
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  process.stdin.pipe(child.stdin);

  child.on('error', (err: Error) => {
    console.log(err);
    process.exit(1);
  });
  child.on('close', () => {
    if (callback instanceof Function) { callback(); }
  });
};
