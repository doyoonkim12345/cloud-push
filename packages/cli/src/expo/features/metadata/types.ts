import type { Environment } from "@cloud-push/cloud";

export type Push = {
    id: string,
    runtimeVersion: string;
    supportIos: boolean;
    supportAndroid: boolean;
    createdAt: number;
    gitHash: string;
    codeSigning: boolean;
    message: string;
    environment?: Environment;
    republishTo?: string
};

export type BranchMetadata = {
    pushes: Push[],
}

export type RuntimeVersionMetadata = {
    isDeprecated: boolean;
}

