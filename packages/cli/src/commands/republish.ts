import { type BranchMetadata, createJsonUint8Array, type ExpoBranch, ExpoClient, type Manifest, parseFileAsJson, } from "@cloud-push/cloud";
import { getExpoConfig } from "../features/expo/lib/getExpoConfig";
import { getExpoStateJson } from "../features/expo/lib/getExpoStateJson";
import { parsePlatforms } from "../features/expo/lib/parsePlatforms";
import { ensureGitRepository } from "../features/git/prompts/ensureGitRepository";
import { getMessage } from "../features/expo/prompts/getMessage";
import { loadExpoEnv } from "../features/expo/lib/loadExpoEnv";
import { loadFileEnv } from "../lib/loadFileEnv";
import { ensureBranchChannel } from "../features/expo/lib/ensureBranchChannel";
import path from "node:path";
import { randomUUID } from "node:crypto";
import { loadConfig } from "@/lib/loadConfig";

const updateBranchMetadata = ({ metadata, updateGroupId, newPushId }: { metadata: BranchMetadata, updateGroupId: string, newPushId: string }): BranchMetadata => {
    const push = metadata.updateGroups.find(p => p.id === updateGroupId)

    if (!push) {
        throw new Error("Push not found in metadata.json")
    }

    const newPush = {
        ...push,
        id: newPushId,
        createdAt: Date.now(),
    }

    const newPushes = metadata.updateGroups.map(p => p.id === updateGroupId ? newPush : p)


    return {
        ...metadata,
        updateGroups: newPushes,
    }
}

const updateManifest = ({ manifest, newPushId, updateGroupId }: { manifest: Manifest, newPushId: string, updateGroupId: string }) => {
    const newManifest: Manifest = {
        ...manifest,
        id: newPushId,
        createdAt: new Date().toISOString(),
        launchAsset: {
            ...manifest.launchAsset,
            url: manifest.launchAsset.url.replace(updateGroupId, newPushId),
        },
        assets: manifest.assets.map(asset => ({
            ...asset,
            url: asset.url.replace(updateGroupId, newPushId),
        })),
        metadata: manifest.metadata,
        extra: manifest.extra,
    }

    return newManifest
}

const parseEnvSource = (envSource: string): 'eas' | 'dotenv' => {
    if (envSource === 'eas') {
        return 'eas'
    } else if (envSource === 'dotenv') {
        return 'dotenv'
    }
    throw new Error("Invalid env source");
}

export const republish = async ({
    message: defaultMessage,
    platform: defaultPlatform,
    branch: defaultBranch,
    channel: defaultChannel,
    destinationBranch: defaultDestinationBranch,
    destinationChannel: defaultDestinationChannel,
    group,
    privateKeyPath,
    rolloutPercentage,
    envSource: defaultEnvSource,
}: {
    message?: string;
    platform: string;
    branch?: string;
    channel?: string;
    destinationBranch?: string;
    destinationChannel?: string;
    group?: string;
    privateKeyPath?: string;
    rolloutPercentage?: number;
    envSource: string;
}) => {
    await ensureGitRepository();
    const platform = parsePlatforms(defaultPlatform)
    const envSource = parseEnvSource(defaultEnvSource)

    // 1) ExpoClient 초기화 (initializeExpoClient 인라인)
    const stateJson = await getExpoStateJson();
    const expoConfigFromFile = await getExpoConfig();
    const projectId = expoConfigFromFile.exp.extra?.eas?.projectId;

    if (!projectId) {
        throw new Error("Project ID not found in app.config.ts");
    }

    const expoClient = new ExpoClient({
        token: process.env.EXPO_TOKEN,
        sessionSecret: stateJson?.auth.sessionSecret,
        appId: projectId,
    });

    const branch = await ensureBranchChannel({
        expoClient,
        branch: defaultBranch,
        channel: defaultChannel,
    })

    let destinationBranch: ExpoBranch | null = null;

    if (defaultDestinationBranch || defaultDestinationChannel) {
        destinationBranch = await ensureBranchChannel({
            expoClient,
            branch: defaultDestinationBranch,
            channel: defaultDestinationChannel,
        })
    }

    const message = await getMessage(defaultMessage)

    if (envSource === 'eas') {
        await loadExpoEnv({
            expoClient,
        })
    } else if (envSource === 'dotenv') {
        await loadFileEnv()
    }

    const { storage } = await loadConfig()
    const metadataJson = await storage.getFile({ key: [branch.id, 'metadata.json'].join('/') })
    const metadata = parseFileAsJson<BranchMetadata>(metadataJson)

    const updateGroupId = metadata.updateGroups[0].id;

    if (!updateGroupId) {
        throw new Error("Push ID not found in metadata.json")
    }

    const androidManifestJson = await storage.getFile({ key: [branch.id, updateGroupId, 'manifest-android.json'].join('/') })
    const iosManifestJson = await storage.getFile({ key: [branch.id, updateGroupId, 'manifest-ios.json'].join('/') })

    const androidManifest = parseFileAsJson<Manifest>(androidManifestJson)
    const iosManifest = parseFileAsJson<Manifest>(iosManifestJson)

    const newPushId = randomUUID()

    const fromDir = path.join(branch.id, updateGroupId)
    const toDir = path.join(destinationBranch?.id ?? branch.id, newPushId)

    const newMetadata = updateBranchMetadata({ metadata, updateGroupId, newPushId })

    const newAndroidManifest = updateManifest({ manifest: androidManifest, newPushId, updateGroupId })
    const newIosManifest = updateManifest({ manifest: iosManifest, newPushId, updateGroupId })

    await storage.moveDirectory({
        fromDir,
        toDir,
        overwrite: true,
    })
    await storage.uploadFile({
        key: [destinationBranch?.id ?? branch.id, 'metadata.json'].join('/'),
        file: createJsonUint8Array(newMetadata),
        contentType: 'application/json',
    });

    await storage.uploadFile({
        key: [destinationBranch?.id ?? branch.id, newPushId, 'manifest-android.json'].join('/'),
        file: createJsonUint8Array(newAndroidManifest),
        contentType: 'application/json',
    });

    await storage.uploadFile({
        key: [destinationBranch?.id ?? branch.id, newPushId, 'manifest-ios.json'].join('/'),
        file: createJsonUint8Array(newIosManifest),
        contentType: 'application/json',
    });

    console.log(`Republished ${branch.name} ${branch.id} to ${destinationBranch?.name ?? branch.name} ${destinationBranch?.id ?? branch.id}`)
    console.log(updateGroupId, `New push id: ${newPushId}`)
}