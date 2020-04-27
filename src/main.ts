import * as core from '@actions/core';
import {create} from './create';
import {parse} from './parse';

async function run(): Promise<void> {
  try {
    const input: string = core.getInput('input')
      ? core.getInput('input')
      : 'CHANGELOG.md';
    const output: string = core.getInput('output')
      ? core.getInput('output')
      : 'sce_sys/changeinfo.xml';

    core.info(`Options: {input: ${input}, output: ${output}}`);
    const markedown: marked.TokensList = await parse(input);
    core.info('Markedown parsed');
    await create(markedown, output);
    core.info('Changeinfo created');
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
