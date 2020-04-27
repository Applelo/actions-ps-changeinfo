import {GitHub, context} from '@actions/github';

export async function gitHub(token: string): Promise<boolean> {
  return new Promise(async resolve => {
    const octokit = new GitHub(token);

    await octokit.pulls
      .create({
        ...context.repo,
        title: '[Vita Changeinfo] New changeinfo update',
        head: `${context.repo.owner}:vita-changeinfo`,
        base: 'master',
      })
      .catch(error => {
        throw error;
      });

    resolve(true);
  });
}
