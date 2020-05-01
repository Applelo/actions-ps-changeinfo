<p>
  <a href="https://github.com/Applelo/actions-vita-changeinfo/actions"><img alt="actions-vita-changeinfo status" src="https://github.com/Applelo/actions-vita-changeinfo/workflows/build-test/badge.svg"></a>
</p>

# Actions PlayStation Changeinfo
> Transform CHANGELOG.md into [changeinfo.xml](https://www.psdevwiki.com/ps4/Changeinfo.xml)

Create a `changeinfo.xml` can be really boring to do if your PS (PS4 or PSVita) application is often updated. Why not use the `CHANGELOG.md` and transform it into a `changeinfo.xml`. This is why I created this action (and also to test how good GitHub solution is).

The action is really simple, give him an input, an output, a github token and it will submit a pull request with a `changeinfo.xml` created/updated: see [#3 pull request](https://github.com/Applelo/actions-vita-changeinfo/pull/2)

## Usage

Create a workflow (eg: `.github/workflows/changeinfo.yml` see [Creating a Workflow file](https://help.github.com/en/articles/configuring-a-workflow#creating-a-workflow-file)) to utilize the action with content:

```yaml
name: "CHANGELOG.md to changeinfo.xml"
on:
  pull_request:
  push:
    branches:
      - master
jobs:
  changeinfo:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: Applelo/actions-ps-changeinfo@v1.1
        with:
          input: "__tests__/CHANGELOG.md" #default: CHANGELOG.md
          output: "__tests__/changeinfo.xml" #default: sce_sys/changeinfo.xml
          token: ${{ secrets.GITHUB_TOKEN }} #required (you don't need to change it)
```

| Options   | Required/Default          | Description                                                     |
| --------- | ------------------------- | --------------------------------------------------------------- |
| `input`   | `CHANGELOG.md`            | The input of the file                                           |
| `output`  | `sce_sys/changeinfo.xml`  | The output of the file                                          |
| `branch`  | `ps-changeinfo`           | The name of the branch use for the pull request                 |
| `token`   | yes                       | The GitHub token, you can use the default `GITHUB_TOKEN`        |

> *Note: This grants access to the GITHUB_TOKEN so the action can make calls to GitHub's rest API*

For the `CHANGELOG.md` example, you can check [this one](https://github.com/Applelo/actions-ps-changeinfo/blob/master/__tests__/CHANGELOG.md)

If the result of the transformation is superior to 64kb (your are large), the file while be reduces with the remove of older version.

# Actions changelog

See [CHANGELOG.md](https://github.com/Applelo/actions-ps-changeinfo/blob/master/CHANGELOG.md)