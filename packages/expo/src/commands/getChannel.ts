import * as prompts from "@clack/prompts";

export const getChannel = async () => {
	const channel = (await prompts.text({
		message:
			'Which channel do you want to set? (e.g. "production", "staging", "preview")',
		validate: (input) =>
			input.trim() === "" ? "Channel name cannot be empty." : undefined,
	})) as string;

	return channel;
};
