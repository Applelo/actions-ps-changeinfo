import {create} from '../src/create';
import {parse} from '../src/parse';
import * as process from 'process';
import * as cp from 'child_process';
import * as path from 'path';
import fs from 'fs';

function readAFile(path: string): Promise<string> {
  return new Promise(resolve => {
    fs.readFile(path, (err, data) => {
      if (err) throw err;
      resolve(data.toString());
    });
  });
}

test('changelog', async () => {
  const markdown = await parse('__tests__/CHANGELOG.md');
  expect(markdown.length).toBe(8);
});

test('changeinfo', async () => {
  const markdown = await parse('__tests__/CHANGELOG.md');
  const created = await create(markdown, '__tests__/changeinfo.xml');
  expect(created).toBe(true);

  const changeinfo = await readAFile('__tests__/changeinfo.xml');
  const expected = await readAFile('__tests__/expected.xml');
  expect(expected).toMatch(expected);
});

// shows how the runner will run a javascript action with env / stdout protocol
test('test runs', () => {
  process.env['INPUT_MILLISECONDS'] = '500';
  const ip = path.join(__dirname, '..', 'lib', 'main.js');
  const options: cp.ExecSyncOptions = {
    env: process.env,
  };
  console.log(cp.execSync(`node ${ip}`, options).toString());
});
