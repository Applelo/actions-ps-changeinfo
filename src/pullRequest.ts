import * as github from '@actions/github';
import * as core from '@actions/core';

export async function pullRequest(
  token: string,
  xml: string,
  output: string,
): Promise<boolean> {
  return new Promise(async resolve => {
    const octokit = new github.GitHub(token);
    const context = github.context;
    const branch = 'vita-changeinfo';

    // create branch
    try {
      await octokit.git.createRef({
        ...context.repo,
        sha: context.sha,
        ref: `refs/heads/${branch}`,
      });
    } catch (error) {
      core.error('unable to create branch');
      core.error(error);
    }

    //get file
    let contents = null;
    try {
      contents = await octokit.repos.getContents({
        ...context.repo,
        path: output,
      });
    } catch (error) {
      core.error('unable to get file');
      core.error(error);
    }

    if (!contents) {
      core.error('no contents');
      return;
    }

    let createOrUpdateFileSHA;

    if (!Array.isArray(contents.data)) {
      createOrUpdateFileSHA = {sha: contents.data.sha};
    }
    // create / update file
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
      core.error('unable to create / update file');
      core.error(error);
    }

    // Pull request
    try {
      await octokit.pulls.create({
        ...context.repo,
        title: '[Vita Changeinfo] New changeinfo update',
        head: branch,
        base: 'master',
      });
    } catch (error) {
      core.error('unable to pull request');
      core.error(error);
    }

    resolve(true);
  });
}
