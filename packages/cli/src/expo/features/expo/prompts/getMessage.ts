import * as prompts from "@clack/prompts";

export const getMessage = async (defaultValue?: string) => {
    if (defaultValue?.trim()) {
        prompts.log.success(`message: ${defaultValue}`);
        return defaultValue;
    }

    const message = (await prompts.text({
        message: 'Enter your message:',
        initialValue: defaultValue,
        validate: (input) =>
            input.trim() === "" ? "Message cannot be empty." : undefined,
    })) as string;

    if (!message) {
        throw new Error("No message provided. Exiting...");
    }

    prompts.log.success(`message: ${message}`);
    return message;
};
