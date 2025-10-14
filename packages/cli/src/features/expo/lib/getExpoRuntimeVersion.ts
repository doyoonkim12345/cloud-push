
import { getExpoConfig } from "./getExpoConfig";

export const getExpoRuntimeVersion = async () => {
    const { exp } = await getExpoConfig();

    const runtimeVersion = exp.runtimeVersion;

    if (!runtimeVersion) {
        throw new Error("runtimeVersion is not defined in app config.");
    }

    if (typeof runtimeVersion === "string") {
        return runtimeVersion;
    }

    if (typeof runtimeVersion === "object") {
        const policy = runtimeVersion.policy;

        switch (policy) {
            case "appVersion":
                if (!exp.version) {
                    throw new Error("version is not defined in app config.");
                }
                return exp.version;

            case "sdkVersion":
                if (!exp.sdkVersion) {
                    throw new Error("sdkVersion is not defined in app config.");
                }
                return exp.sdkVersion;

            default:
                throw new Error(`Unsupported runtimeVersion policy: ${policy}`);
        }
    }

    throw new Error("Invalid runtimeVersion format.");
};
