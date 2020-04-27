import marked from 'marked';
import fs from 'fs';

export async function parse(input: string): Promise<marked.TokensList> {
  return new Promise(resolve => {
    fs.readFile(input, (err, data) => {
      if (err) throw err;
      const lexer: marked.TokensList = marked.lexer(data.toString());
      resolve(lexer);
    });
  });
}
