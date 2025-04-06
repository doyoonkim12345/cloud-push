import { ExpoConfig, ConfigContext } from "expo/config";
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
    url: `http://192.168.0.36:3000/api/${process.env.APP_VARIANT}/manifest`,
    enabled: true,
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
});
