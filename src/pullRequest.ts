import * as github from '@actions/github';
import * as core from '@actions/core';

export async function pullRequest(
  token: string,
  xml: string,
  output: string,
): Promise<boolean> {
  return new Promise(async (resolve, reject) => {
    const octokit = new github.GitHub(token);
    const context = github.context;
    const branch = 'ps-changeinfo';

    // create branch
    core.info('create branch');
    try {
      await octokit.git.createRef({
        ...context.repo,
        sha: context.sha,
        ref: `refs/heads/${branch}`,
      });
    } catch (error) {
      core.info('unable to create branch');
      core.info(error);
    }

    //get file
    core.info('get file');
    let contents = null;
    try {
      contents = await octokit.repos.getContents({
        ...context.repo,
        path: output,
        ref: branch,
      });
    } catch (error) {
      core.info('unable to get file');
      core.info(error);
    }

    let createOrUpdateFileSHA;

    if (contents && !Array.isArray(contents.data)) {
      createOrUpdateFileSHA = {sha: contents.data.sha};
    }

    // create / update file
    core.info('create/update file');
    try {
      await octokit.repos.createOrUpdateFile(
        Object.assign(
          {
            ...context.repo,
            branch,
            content: Buffer.from(xml).toString('base64'),
            committer: {
              name: 'GitHub Actions',
              email: 'actions@github.com',
            },
            path: output,
            message: 'Add/Update changeinfo.xml',
            sha: createOrUpdateFileSHA,
          },
          createOrUpdateFileSHA,
        ),
      );
    } catch (error) {
      core.error(error);
      reject(Error('unable to create / update file'));
    }

    // Pull request
    core.info('check if pull request already exist');
    let pullRequests;
    try {
      pullRequests = await octokit.pulls.list({
        ...context.repo,
        head: `${context.repo.owner}:${branch}`,
        state: 'open',
      });
    } catch (error) {
      core.info('unable to get pull request');
      core.info(error);
    }

    if (pullRequests) {
      resolve(true);
      return;
    }

    core.info('create pull request');
    try {
      await octokit.pulls.create({
        ...context.repo,
        title: '[PS Changeinfo] Changeinfo update',
        head: branch,
        base: 'master',
      });
    } catch (error) {
      core.info(error);
      reject(Error('unable to create pull request'));
    }

    resolve(true);
  });
}
