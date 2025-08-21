import { execa } from 'execa';

export async function getGitBranch() {
    const { stdout } = await execa('git', ['rev-parse', '--abbrev-ref', 'HEAD']);
    return stdout;
}
