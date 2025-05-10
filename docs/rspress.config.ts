import * as path from "node:path";
import { defineConfig } from "rspress/config";

export default defineConfig({
	root: path.join(__dirname, "docs"),
	title: "Cloud Push",
	icon: "/logo.png",
	logo: {
		light: "/logo.png",
		dark: "/logo.png",
	},
	logoText: "Cloud Push",
	themeConfig: {
		socialLinks: [
			{
				icon: "github",
				mode: "link",
				content: "https://github.com/doyoonkim12345/cloud-push",
			},
		],
	},
});
