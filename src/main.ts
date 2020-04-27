import * as core from '@actions/core';
import {create} from './create';
import {parse} from './parse';

async function run(): Promise<void> {
  try {
    create();
    parse();
  } catch (error) {
    core.setFailed(error.message);
  }
}

run();
