import marked from 'marked';
import fs from 'fs';

export async function parse(input: string): Promise<marked.TokensList> {
  return new Promise((resolve, reject) => {
    fs.readFile(input, (err, data) => {
      if (err) reject(err);
      const lexer: marked.TokensList = marked.lexer(data.toString());
      resolve(lexer);
    });
  });
}
