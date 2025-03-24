import { ExpoConfig, ConfigContext } from "expo/config";
import version from "./version";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "sdk52",
  slug: "sdk52",
  version: version.VERSION,
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "myapp",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  updates: {
    url: "http://192.168.0.36:3000/api/manifest",
    enabled: true,
  },
  runtimeVersion: {
    policy: "appVersion",
  },
  ios: {
    supportsTablet: true,
    bundleIdentifier: "com.expo.sdk52",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    package: "com.expo.sdk52",
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {
      origin: false,
    },
    eas: {
      projectId: "6d9e2f9f-1b8f-4c60-ad81-2c10097308e9",
    },
  },
  owner: "durun_onout",
});
