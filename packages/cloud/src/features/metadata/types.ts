import type { Environment } from "@/types";

export type UpdateGroup = {
    id: string,
    runtimeVersion: string;
    supportIos: boolean;
    supportAndroid: boolean;
    createdAt: number;
    gitHash: string;
    codeSigning: boolean;
    message: string;
    environment?: Environment,
    isForceUpdateRequired: boolean
};

export type UpdateGroupUpdateStatus = {
    [updateGroupId: string]: {
        isForceUpdateRequired: boolean;
    }
}

export type BranchMetadata = {
    updateGroups: UpdateGroup[],
}

export type RuntimeVersionUpdateStatus = {
    [runtimeVersion: string]: {
        isDeprecated: boolean;
    }
}

export type RuntimeVersionMetadata = {
    runtimeVersions: string[]
}

