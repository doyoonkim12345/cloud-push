import { execa } from "execa";

type S3_KEY =
  | "AWS_BUCKET_NAME"
  | "AWS_REGION"
  | "AWS_SECRET_ACCESS_KEY"
  | "AWS_ACCESS_KEY_ID";

export default async function loadEnv<T extends S3_KEY>(
  keys: T[]
): Promise<{ [key in T]: string }> {
  try {
    const { stdout } = await execa(
      "eas",
      [
        "env:exec",
        "development",
        `node -e "console.log({${keys
          .map((key) => [key, `process.env.${key}`].join(":"))
          .join(",")}})"`,
      ],
      { stdio: "pipe" }
    );

    const env = stdout
      .split("\n")
      .filter((line) => line.startsWith("[stdout]"))
      .map((e) => e.replaceAll("[stdout]", ""))
      .join("");

    const parsedEnv = eval("(" + env + ")");

    return parsedEnv;
  } catch (e) {
    throw new Error(
      "This project does not manage environment variables through EAS. Please upload the environment variables via eas env or expo.dev."
    );
  }
}
