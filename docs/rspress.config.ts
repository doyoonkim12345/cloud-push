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
	head: [
		[
			"meta",
			{
				name: "description",
				content:
					"Cloud Push is a simple and frontend-developer-friendly OTA update manager for Expo apps. Easily distribute and manage updates with CLI and web dashboard.",
			},
		],
		[
			"meta",
			{
				name: "keywords",
				content:
					"Expo, OTA updates, React Native, Cloud Push, app deployment, update management, expo OTA, expo update system, eas, eas update, free code push, code push, hot-updater, react-native-ota, expo-updates",
			},
		],
		["meta", { property: "og:title", content: "Cloud Push" }],
		[
			"meta",
			{
				property: "og:description",
				content:
					"A seamless OTA update solution for Expo apps with CLI and dashboard support.",
			},
		],
		["meta", { property: "og:type", content: "website" }],
		[
			"meta",
			{
				property: "og:url",
				content: "https://doyoonkim12345.github.io/cloud-push/",
			},
		],
		[
			"meta",
			{
				property: "og:image",
				content: "https://doyoonkim12345.github.io/cloud-push/logo.png",
			},
		],
	],
});
