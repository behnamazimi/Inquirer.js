import * as readline from 'node:readline';
import { EventEmitter } from 'node:events';

const rl = readline.createInterface({
  terminal: true,
  input: process.stdin,
  output: process.stdout,
}) as readline.Interface & { input: EventEmitter };

interface Key {
  sequence?: string;
  name?: string;
  ctrl?: boolean;
  meta?: boolean;
  shift?: boolean;
}

function handler(_input: string, key: Key) {
  process.stdout.write(JSON.stringify(key, null, 2) + `\n`);
  if (key.ctrl && key.name === 'c') {
    rl.input.removeListener('keypress', handler);
    rl.close();
  }
}

rl.input.on('keypress', handler);
console.log('Press any key...');
