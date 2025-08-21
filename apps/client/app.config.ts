import type { ExpoConfig, ConfigContext } from "expo/config";
import sharedConfig from "./sharedConfig";
import type { AppConfig } from "@cloud-push/expo";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	owner: "durun_onout",
	name: "client",
	slug: "client",
	version: sharedConfig.runtimeVersion,
	runtimeVersion: {
		policy: "appVersion",
	},
	orientation: "portrait",
	icon: "./assets/cloud-push-logo.png",
	userInterfaceStyle: "light",
	newArchEnabled: true,
	splash: {
		image: "./assets/splash-icon.png",
		resizeMode: "contain",
		backgroundColor: "#ffffff",
	},
	ios: {
		supportsTablet: true,
		bundleIdentifier: "com.durun-onout.client",
	},
	updates: {
		url: sharedConfig.updateBundleUrl,
		requestHeaders: {
			"expo-channel-name": 'feconf',//process.env.EXPO_CHANNEL_NAME,
		},
		fallbackToCacheTimeout: 30 * 1000
		// codeSigningMetadata: {
		// 	alg: "rsa-v1_5-sha256",
		// 	keyid: "main",
		// },
		// codeSigningCertificate: sharedConfig.certificatePath,
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
			"projectId": "d8a690b9-2a40-4d9c-b8ab-dee5b91f4ee7"
		},
		cloudPush: {
			checkUpdateStatusUrl: "http://192.168.0.4:3000/api/updates/status",
		} as AppConfig,
	},
});
