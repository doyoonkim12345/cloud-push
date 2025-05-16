import * as path from "node:path";
import { defineConfig } from "rspress/config";

export default defineConfig({
	root: path.join(__dirname, "docs"), // 마크다운, index.md 등 위치
	base: "/cloud-push/", // ✅ GitHub Pages 경로 기준
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
