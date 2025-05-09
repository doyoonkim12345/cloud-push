import type { ExpoConfig, ConfigContext } from "expo/config";
import version from "./version";

export default ({ config }: ConfigContext): ExpoConfig => ({
	...config,
	name: "client",
	slug: "client",
	version: version.runtimeVersion,
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
		url: "http://192.168.0.36:3000/api/manifest",
		requestHeaders: {
			"expo-channel-name": process.env.CHANNEL,
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
	},
});
