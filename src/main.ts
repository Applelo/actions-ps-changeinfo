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
    const branch: string = core.getInput('branch'); //default 'ps-changeinfo'

    const markedown: marked.TokensList | void = await parse(input).catch(
      error => {
        throw error;
      },
    );

    if (!markedown) {
      throw Error('Markdown parsed failed');
    }

    core.info('Markedown parsed');
    const xmlBase64 = await create(markedown).catch(error => {
      throw error;
    });

    if (!xmlBase64) {
      throw Error('changeingo creation failed');
    }
    core.info('Changeinfo created');

    await pullRequest(token, branch, xmlBase64, output).catch(error => {
      throw error;
    });
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
