import * as github from '@actions/github';

export async function pullRequest(token: string): Promise<boolean> {
  return new Promise(async resolve => {
    const octokit = new github.GitHub(token);
    const context = github.context;

    // create branch
    await octokit.git.createRef({
      ...context.repo,
      sha: context.sha,
      ref: 'refs/heads/vita-changeinfo',
    });

    // commit file

    // Pull request
    await octokit.pulls
      .create({
        ...context.repo,
        title: '[Vita Changeinfo] New changeinfo update',
        head: 'vita-changeinfo',
        base: 'master',
      })
      .catch(error => {
        throw error;
      });

    resolve(true);
  });
}
