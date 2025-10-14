import type { Environment, Platform } from "@cloud-push/cloud";
import type { UpdateGroup } from "../types";

export function generateUpdateGroup({
    runtimeVersion,
    platforms,
    environment,
    gitHash,
    message,
    codeSigning,
    id,
}: {
    runtimeVersion: string,
    platforms: Platform[],
    gitHash: string,
    message: string,
    codeSigning: boolean,
    id: string,
    environment?: Environment,
}): UpdateGroup {

    const createdAt = Date.now();

    return {
        runtimeVersion,
        supportIos: platforms.includes('ios'),
        supportAndroid: platforms.includes('android'),
        createdAt,
        environment,
        gitHash,
        message,
        codeSigning,
        id,
    }
}   