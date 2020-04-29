import builder from 'xmlbuilder';
// import fs from 'fs';

export async function create(markdown: marked.TokensList): Promise<string> {
  return new Promise(resolve => {
    const changelog: Map<string, string[]> = new Map();
    let currentVersion = '';

    for (const item of markdown) {
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
        currentVersion = version;

        //@ts-ignore
      } else if (item.type === 'list') {
        //@ts-ignore
        const listItems = item.items;
        const list: string[] = [''];

        for (const listItem of listItems) {
          list.push(listItem.raw.trim());
        }
        list.push('');

        changelog.set(currentVersion, list);
      }
    }

    const changelogKeys = Array.from(changelog.keys()).reverse();

    const changeinfo = builder.create('changeinfo');
    for (const version of changelogKeys) {
      const list = changelog.get(version);
      if (list) {
        const changes = changeinfo.ele('changes');

        changes.att('app_ver', version);
        changes.dat(list.join('\n'));
      }
    }
    const xml = changeinfo.end({pretty: true});
    // fs.writeFile('__tests__/changeinfo.xml', xml, () => {});

    resolve(xml);
  });
}
