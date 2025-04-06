export const parseStdout = <T extends any>(stdout: string): T => {
  const env = stdout
    .split("\n")
    .filter((line) => line.startsWith("[stdout]"))
    .map((e) => e.replaceAll("[stdout]", ""))
    .join("");

  const parsedEnv = eval("(" + env + ")");
  return parsedEnv;
};
