import type { ExpoConfig, ConfigContext } from "expo/config";
import sharedConfig from "./sharedConfig";
import type { AppConfig } from "@cloud-push/expo";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "client",
	slug: "client",
	version: sharedConfig.runtimeVersion,
	runtimeVersion: {
		policy: "appVersion",
	},
	orientation: "portrait",
	icon: "./assets/icon.png",
	userInterfaceStyle: "light",
	newArchEnabled: true,
	splash: {
		image: "./assets/splash-icon.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff",
	},
	ios: {
		supportsTablet: true,
	},
	updates: {
		url: sharedConfig.updateBundleUrl,
		requestHeaders: {
			"expo-channel-name": sharedConfig.channel,
		},
	},
	android: {
		adaptiveIcon: {
			foregroundImage: "./assets/adaptive-icon.png",
			backgroundColor: "#ffffff",
		},
		package: "com.durun_onout.client",
	},
	web: {
		favicon: "./assets/favicon.png",
	},
	plugins: [
		[
			"expo-splash-screen",
			{
				backgroundColor: "#232323",
				image: "./assets/splash-icon.png",
				dark: {
					image: "./assets/splash-icon.png",
					backgroundColor: "#000000",
				},
				imageWidth: 200,
			},
		],
		[
			"expo-build-properties",
			{
				android: {
					usesCleartextTraffic: true,
				},
				ios: {},
			},
		],
	],
	extra: {
		eas: {
			projectId: "9d11153f-925e-414c-a409-4fe5c747799e",
		},
		cloudPush: {
			checkUpdateStatusUrl: sharedConfig.updateBundleUrl,
		} as AppConfig,
	},
});
