import type { AppConfig } from "@/types";
import * as Constants from "expo-constants";

export const getConfig = () => {
	return (Constants.default.expoConfig?.extra?.cloudPush ?? {}) as AppConfig;
};
