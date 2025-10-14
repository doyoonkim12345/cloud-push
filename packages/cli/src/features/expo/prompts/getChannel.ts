import * as prompts from "@clack/prompts";

export const getChannel = async (defaultValue?: string) => {
	if (defaultValue?.trim()) {
		prompts.log.success(`channel: ${defaultValue}`);
		return defaultValue;
	}

	const channel = (await prompts.text({
		message:
			'Which channel do you want to set? (e.g. "production", "staging", "preview")',
		initialValue: defaultValue,
		validate: (input) =>
			input.trim() === "" ? "Channel name cannot be empty." : undefined,
	})) as string;

	if (!channel) {
		throw new Error("No channel provided. Exiting...");
	}

	return channel;
};
