import * as core from '@actions/core';
import {create} from './create';
import {parse} from './parse';
import {gitHub} from './github';

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token');
    if (!token) core.error('No GitHub Token');

    const input: string = core.getInput('input'); //default 'CHANGELOG.md'
    const output: string = core.getInput('output'); //default 'sce_sys/changeinfo.xml'

    core.info(`Options: {input: ${input}, output: ${output}}`);
    const markedown: marked.TokensList = await parse(input);
    core.info('Markedown parsed');
    await create(markedown, output);
    core.info('Changeinfo created');
    await gitHub(token);
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
