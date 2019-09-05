
/**
 * 1. get argv command
 * 2. execute command sync one by one
 */
const argvs = process.argv.slice(2);
const command = argvs[1]; // argvs[0] must be 'run', argvs may be dist/test/build/bundle
