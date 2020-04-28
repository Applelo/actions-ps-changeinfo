import * as github from '@actions/github';

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
    await octokit.git
      .createRef({
        ...context.repo,
        sha: context.sha,
        ref: `refs/heads/${branch}`,
      })
      .catch(() => {});

    //get file
    const contents = await octokit.repos.getContents({
      ...context.repo,
      path: output,
    });

    let createOrUpdateFileSHA;

    if (!Array.isArray(contents.data)) {
      createOrUpdateFileSHA = {sha: contents.data.sha};
    }
    // create / update file
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

    // Pull request
    await octokit.pulls
      .create({
        ...context.repo,
        title: '[Vita Changeinfo] New changeinfo update',
        head: branch,
        base: 'master',
      })
      .catch(error => {
        throw error;
      });

    resolve(true);
  });
}
