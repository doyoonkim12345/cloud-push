export const parseStdout = <T extends {}>(stdout: string): T => {
  const env = stdout
    .split("\n")
    .filter((line) => line.includes("="))
    .map((e) => e.split("="))
    .reduce((acc, [key, value]) => {
      return { ...acc, [key]: value };
    }, {} as T);

  return env;
};
