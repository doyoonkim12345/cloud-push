import { execa } from 'execa';
import * as prompts from "@clack/prompts";

export async function getIsGitRepository(dir: string = process.cwd()) {
    try {
        await execa('git', ['rev-parse', '--is-inside-work-tree'], { cwd: dir });
        prompts.log.info('✅ Git repository detected.');
        return true;
    } catch {
        prompts.log.error('❌ Not a Git repository.');
        return false;
    }
}

