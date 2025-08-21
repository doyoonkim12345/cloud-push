import { execa } from "execa";
import { getIsGitRepository } from "./getIsGitRepository";
import * as prompts from "@clack/prompts";

export async function ensureGitRepository() {
  prompts.intro('🔧 Git Repository Check');

  const isRepo = await getIsGitRepository();
  if (isRepo) {
    prompts.note('Git repository already initialized.', '✅ OK');
    return;
  }

  prompts.log.message('\n❗ A git repository is required for building your project.\n');

  const shouldInit = await prompts.confirm({
    message: "Would you like to initialize a Git repository now?",
    initialValue: true,
  });

  if (shouldInit) {
    await execa('git', ['init']);
    prompts.note('Git repository initialized.', '✅ Success');
  } else {
    prompts.outro();
    throw new Error('❌ Git repository not initialized. Please run `git init` and try again.');
  }
}