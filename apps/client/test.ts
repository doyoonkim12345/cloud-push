import { execa } from "execa";

execa(
	"expo",
	[
		"export",
		...["android"].flatMap((platform) => [
			"--platform",
			platform.toLocaleLowerCase(),
		]),
	],
	{ env: { NODE_ENV: "development", stdio: "inherit" } },
);
