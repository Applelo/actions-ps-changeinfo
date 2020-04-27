import github from '@actions/github';

export async function gitHub(token: string): Promise<boolean> {
  return new Promise(async resolve => {
    const octokit = new github.GitHub(token);
    const context = github.context;

    await octokit.pulls.create({
      ...context.repo,
      title: '[Vita Changeinfo] New changeinfo update',
      head: `${context.repo.owner}:vita-changeinfo`,
      base: 'master',
    });

    resolve(true);
  });
}
