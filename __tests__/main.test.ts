import {create} from '../src/create';
import {parse} from '../src/parse';
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
  expect(markdown.length).toBe(10);
});

test('changeinfo', async () => {
  const markdown = await parse('__tests__/CHANGELOG.md');
  const created = await create(markdown);
  const expected = await readAFile('__tests__/expected.xml');
  expect(created).toMatch(expected);
});
