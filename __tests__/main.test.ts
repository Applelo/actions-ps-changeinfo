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

function createAFile(path: string, data: string): Promise<true> {
  return new Promise(resolve => {
    fs.writeFile(path, data, err => {
      if (err) throw err;
      resolve(true);
    });
  });
}

test('changelog', async () => {
  const markdown = await parse('__tests__/CHANGELOG.md');
  expect(markdown.length).toBe(10);
});

test('changeinfo string', async () => {
  const markdown = await parse('__tests__/CHANGELOG.md');
  const created = await create(markdown, false);
  const expected = await readAFile('__tests__/expected.xml');
  expect(created).toMatch(expected);
});

test('changeinfo base64', async () => {
  const markdown = await parse('__tests__/CHANGELOG.md');
  const created = await create(markdown);
  const expected = await readAFile('__tests__/expected.xml');
  expect(created).toMatch(Buffer.from(expected).toString('base64'));
});

// test('changeinfo limit to 64kb', async () => {
//   // generate an heavy markdown superiror at 64kb
//   let heavy = '';
//   for (let i = 1; i <= 100; i++) {
//     heavy += `# ${i}.0\n\n`;
//     for (let j = 0; j <= 100; j++) {
//       heavy += '- Feature\n';
//     }
//     heavy += '\n';
//   }

//   await createAFile('__tests__/CHANGELOG-heavy.md', heavy);
//   const markdown = await parse('__tests__/CHANGELOG-heavy.md');
//   const created = await create(markdown, false);
//   const bufferLength = Buffer.from(created).byteLength;
//   expect(bufferLength / 1000).toBeLessThan(64);

//   const expected = await readAFile('__tests__/expected-heavy.xml');
//   expect(created).toMatch(expected);
// });
