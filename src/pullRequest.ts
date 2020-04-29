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
    const branch = 'vita-changeinfo';

    // create branch
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
    let sha = null;
    try {
      // Not working, I don't know why
      // contents = await octokit.repos.getContents({
      //   ...context.repo,
      //   path: output,
      //   ref: branch,
      // });
      sha = octokit.repos.get.endpoint({
        url: `https://api.github.com/repos/${context.repo.owner}/${context.repo.repo}/contents/${output}?ref=${branch}`,
      }).body.sha;
    } catch (error) {
      core.info('unable to get file');
      core.info(error);
    }

    let createOrUpdateFileSHA;

    if (sha) {
      createOrUpdateFileSHA = {sha};
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
      core.error(error);
      reject(Error('unable to create / update file'));
    }

    let pullRequests;

    try {
      pullRequests = await octokit.pulls.list({
        ...context.repo,
        head: branch,
        state: 'open',
      });
    } catch (error) {
      core.info('unable to get pull request');
      core.info(error);
    }

    if (pullRequests) return;

    // Pull request
    try {
      await octokit.pulls.create({
        ...context.repo,
        title: '[Vita Changeinfo] Changeinfo update',
        head: branch,
        base: 'master',
      });
    } catch (error) {
      core.info('unable to create pull request');
      core.info(error);
    }

    resolve(true);
  });
}
