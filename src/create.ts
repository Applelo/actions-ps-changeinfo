import builder from 'xmlbuilder';

export async function create(markdown: marked.TokensList): Promise<string> {
  return new Promise(resolve => {
    const changeinfo = builder.create('changeinfo');

    for (const item of markdown) {
      const changes = changeinfo.ele('changes');
      if (item.type === 'heading' && item.depth === 1) {
        const versionParts = item.text.split('.');
        const versionFirst =
          versionParts[0].length === 1
            ? `0${versionParts[0]}`
            : `${versionParts[0]}`;
        const versionSecond =
          versionParts[1].length === 1
            ? `${versionParts[1]}0`
            : `${versionParts[1]}`;
        const version = `${versionFirst}.${versionSecond}`;
        changes.att('app_ver', version);
        //@ts-ignore
      } else if (item.type === 'list') {
        //@ts-ignore
        const listItems = item.items;
        const list: string[] = [''];

        for (const listItem of listItems) {
          list.push(listItem.raw.trim());
        }
        list.push('');

        changes.dat(list.join('\n'));
      }
    }

    const xml = changeinfo.end({pretty: true});

    resolve(xml);
  });
}
