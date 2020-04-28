import * as core from '@actions/core';
import {create} from './create';
import {parse} from './parse';
import {pullRequest} from './pullRequest';

async function run(): Promise<void> {
  try {
    const token: string = core.getInput('token');
    if (!token) core.error('No GitHub Token');

    const input: string = core.getInput('input'); //default 'CHANGELOG.md'
    const output: string = core.getInput('output'); //default 'sce_sys/changeinfo.xml'

    const markedown: marked.TokensList | void = await parse(
      input,
    ).catch(error => core.error(error));

    if (!markedown) {
      core.info('Markdown parsed failed');
      throw Error('Markdown parsed failed');
    }

    core.info('Markedown parsed');
    const xml = await create(markedown).catch(error => core.error(error));

    if (!xml) {
      core.info('Changeingo creation failed');
      throw Error('changeingo creation failed');
    }
    core.info('Changeinfo created');

    await pullRequest(token, xml, output).catch(error => core.error(error));
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
