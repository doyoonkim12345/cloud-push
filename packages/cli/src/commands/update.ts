import { type Environment, ExpoClient, type StorageClient, type Platform, createManifest, createJsonUint8Array, getCwd, ensureRuntimeVersionMetadata, generateRuntimeVersionMetadataKey, ensureRuntimeVersionUpdateStatus, generateBranchMetadataKey, generateUpdateGroup, ensureBranchMetadata, generateLocalManifestPath, generateManifestKey, generateCloudPath, generateRuntimeVersionUpdateStatusKey } from "@cloud-push/cloud";
import path from "node:path";
import fs from "node:fs/promises";
import * as prompts from "@clack/prompts";
import { getExpoConfig } from "../features/expo/lib/getExpoConfig";
import { getExpoStateJson } from "../features/expo/lib/getExpoStateJson";
import { exportBundles } from "../features/expo/prompts/exportBundles";
import { getMessage } from "../features/expo/prompts/getMessage";
import { ensureGitRepository } from "../features/git/prompts/ensureGitRepository";
import { getGitBranch } from "../features/git/prompts/getGitBranch";
import { getGitCommitMessage } from "../features/git/prompts/getGitCommitMessage";
import { loadFileEnv } from "../lib/loadFileEnv";
import { loadExpoEnv } from "../features/expo/lib/loadExpoEnv";
import { signBundle } from "../features/expo/prompts/signBundle";
import { getExpoRuntimeVersion } from "../features/expo/lib/getExpoRuntimeVersion";
import { randomUUID } from "node:crypto";
import { exportExpoConfig } from "../features/expo/prompts/exportExpoConfig";
import { getGitCommitHash } from "../features/git/prompts/getGitCommitHash";
import { parsePlatforms } from "../features/expo/lib/parsePlatforms";
import { ensureBranchChannel, } from "../features/expo/lib/ensureBranchChannel";
import { loadConfig } from "@/lib/loadConfig";

/**
 * 메타데이터 구조 설명 (3가지 병렬 처리):
 * 
 * 1. 브랜치 메타데이터 (브랜치별)
 *    - 위치: {branchId}/metadata.json
 *    - 역할: 브랜치의 updateGroups 정보 관리
 *    - 내용: { updateGroups: [{ id, runtimeVersion, platforms, ... }, ...] }
 *    - 용도: 특정 브랜치의 업데이트 그룹 목록 조회
 * 
 * 2. 런타임 버전 업데이트 상태 (브랜치별)
 *    - 위치: {branchId}/updateStatus.json
 *    - 역할: 각 브랜치의 런타임 버전별 업데이트 정책 관리
 *    - 내용: { "1.0.0": { isDeprecated: false, isForceUpdateRequired: false }, ... }
 *    - 용도: 앱이 특정 런타임 버전에서 업데이트를 강제하거나 deprecated 경고를 표시할지 결정
 * 
 * 3. 글로벌 런타임 버전 메타데이터 (전역)
 *    - 위치: metadata.json (루트)
 *    - 역할: 전체 프로젝트에서 사용 가능한 런타임 버전 목록 관리
 *    - 내용: { runtimeVersions: ["1.0.0", "1.1.0", "2.0.0", ...] }
 *    - 용도: 대시보드나 CLI에서 사용 가능한 런타임 버전 목록을 조회할 때 사용
 * 
 * ※ 세 메타데이터는 독립적이며 병렬로 처리됩니다.
 */

// 추상화된 헬퍼 함수들

/**
 * Expo 클라이언트를 초기화합니다
 */
async function initializeExpoClient(): Promise<ExpoClient> {
    const stateJson = await getExpoStateJson();
    const expoConfigFromFile = await getExpoConfig();
    const projectId = expoConfigFromFile.exp.extra?.eas?.projectId;

    if (!projectId) {
        throw new Error("Project ID not found in app.config.ts");
    }

    return new ExpoClient({
        token: process.env.EXPO_TOKEN,
        sessionSecret: stateJson?.auth.sessionSecret,
        appId: projectId,
    });
}

/**
 * 브랜치명과 메시지를 결정합니다
 */
async function resolveBranchNameAndMessage(options: {
    defaultMessage?: string;
    defaultBranchName?: string;
    auto: boolean;
    nonInteractive: boolean;
}): Promise<{ message?: string; branchName?: string }> {
    const gitBranch = (await getGitBranch()) ?? "";
    const gitMessage = (await getGitCommitMessage()) ?? "";

    let currentMessage = options.defaultMessage;
    let currentBranchName = options.defaultBranchName;

    if (options.auto) {
        currentMessage = currentMessage ?? gitMessage;
        currentBranchName = currentBranchName ?? gitBranch;
    }

    if (options.nonInteractive) {
        if (!currentBranchName || !currentMessage) {
            throw new Error(
                "--branch and --message, or --channel and --message are required when updating in non-interactive mode unless --auto is specified"
            );
        }
    } else {
        const updatedMessage = (await getMessage(currentMessage)) ?? "";
        currentMessage = currentMessage ?? updatedMessage;
    }

    return { message: currentMessage, branchName: currentBranchName };
}

/**
 * 환경변수를 로드합니다
 */
async function loadEnvironment(options: {
    defaultEnvironment?: string;
    envSource: string;
    expoClient: ExpoClient;
}): Promise<Environment | undefined> {
    const validEnvironment: Environment | undefined = ["development", "preview", "production"].includes(
        options.defaultEnvironment ?? ""
    )
        ? (options.defaultEnvironment as Environment)
        : undefined;

    if (validEnvironment) {
        if (options.envSource === "eas" && options.expoClient) {
            await loadExpoEnv({ environment: validEnvironment, expoClient: options.expoClient });
        } else if (options.envSource === "dotenv") {
            await loadFileEnv(validEnvironment);
        }
    }

    return validEnvironment;
}

/**
 * 번들을 처리합니다 (빌드 및 서명)
 */
async function processBundles(options: {
    skipBundler: boolean;
    bundlePath: string;
    platforms: Platform[];
    clearCache: boolean;
    privateKeyPath?: string;
}): Promise<void> {
    if (!options.skipBundler) {
        await exportBundles({
            bundlePath: options.bundlePath,
            platforms: options.platforms,
            isClearCache: options.clearCache
        });

        if (options.privateKeyPath) {
            signBundle({ privateKeyPath: options.privateKeyPath });
        }
    }
}

/**
 * 번들 디렉터리를 업로드합니다
 */
async function uploadBundleDirectory({
    storageClient,
    bundlePath,
    cloudPath,
}: {
    storageClient: StorageClient;
    bundlePath: string;
    cloudPath: string;
}): Promise<void> {
    const configSpinner = prompts.spinner();
    configSpinner.start("📝 Exporting Expo config...");

    await exportExpoConfig({ expoConfigPath: bundlePath });
    configSpinner.stop("✅ Expo config exported successfully");

    const directorySpinner = prompts.spinner();
    directorySpinner.start("📦 Uploading bundle directory...");

    await storageClient.uploadDirectory({
        cloudPath,
        directoryPath: bundlePath
    });

    directorySpinner.stop("✅ Bundle directory uploaded successfully");
}

/**
 * 플랫폼별 매니페스트를 생성하고 업로드합니다
 */
async function uploadManifests({
    storageClient,
    platforms,
    updateId,
    runtimeVersion,
    bundlePath,
    cloudPath,
}: {
    storageClient: StorageClient;
    platforms: Platform[];
    updateId: string;
    runtimeVersion: string;
    bundlePath: string;
    cloudPath: string;
}): Promise<void> {
    const manifestSpinner = prompts.spinner();
    manifestSpinner.start(`📋 Generating and uploading manifests for ${platforms.join(', ')}...`);

    const expoConfig = await getExpoConfig();

    for (const plt of platforms) {
        const manifest = await createManifest({
            updateId,
            runtimeVersion,
            platform: plt,
            storageClient,
            cloudPath,
            bundlePath,
            extra: expoConfig.exp.extra,
        });

        const localManifestPath = generateLocalManifestPath(bundlePath, plt);
        await fs.writeFile(localManifestPath, JSON.stringify(manifest, null, 2));

        await storageClient.uploadFile({
            key: generateManifestKey(cloudPath, plt),
            file: await fs.readFile(localManifestPath),
            contentType: "application/json",
        });
    }

    manifestSpinner.stop(`✅ Manifests for ${platforms.join(', ')} uploaded successfully`);
}

/**
 * 브랜치 메타데이터를 업데이트합니다 (브랜치별 metadata.json)
 * - 위치: {branchId}/metadata.json
 * - 역할: 브랜치의 updateGroups 정보 관리
 * - 내용: { updateGroups: [...] }
 */
async function updateBranchMetadata({
    storageClient,
    branchId,
    runtimeVersion,
    platforms,
    environment,
    gitHash,
    message,
    codeSigning,
    updateId,
}: {
    storageClient: StorageClient;
    branchId: string;
    runtimeVersion: string;
    platforms: Platform[];
    environment?: Environment;
    gitHash: string;
    message: string;
    codeSigning: boolean;
    updateId: string;
}): Promise<void> {
    const branchMetadataSpinner = prompts.spinner();
    branchMetadataSpinner.start("🔍 Ensuring branch metadata...");

    const branchMetadata = await ensureBranchMetadata({
        storageClient,
        branchId,
    });

    branchMetadataSpinner.stop("✅ Branch metadata ensured successfully");

    const metadataSpinner = prompts.spinner();
    metadataSpinner.start("🔄 Generating updateGroup metadata...");

    const updatedBranchMetadata = {
        ...branchMetadata,
        updateGroups: [
            generateUpdateGroup({
                runtimeVersion,
                platforms,
                environment,
                gitHash,
                message,
                codeSigning,
                id: updateId,
            }),
            ...branchMetadata.updateGroups,
        ],
    };

    metadataSpinner.stop("✅ Push metadata generated successfully");

    const uploadSpinner = prompts.spinner();
    uploadSpinner.start("⬆️  Uploading branch metadata...");

    await storageClient.uploadFile({
        key: generateBranchMetadataKey(branchId),
        file: createJsonUint8Array(updatedBranchMetadata),
        contentType: "application/json",
    });

    uploadSpinner.stop("✅ Branch metadata uploaded successfully");
}

/**
 * 런타임 버전 업데이트 상태를 관리합니다 (브랜치별 updateStatus.json)
 * - 각 브랜치의 런타임 버전별 deprecation 및 force update 설정
 * - 파일 위치: {branchId}/updateStatus.json
 */
async function updateRuntimeVersionUpdateStatus({
    storageClient,
    branchId,
    runtimeVersion,
}: {
    storageClient: StorageClient;
    branchId: string;
    runtimeVersion: string;
}): Promise<void> {
    const statusSpinner = prompts.spinner();
    statusSpinner.start("🔍 Ensuring runtime version update status...");

    const runtimeVersionUpdateStatus = await ensureRuntimeVersionUpdateStatus({
        storageClient,
        branchId,
    });

    statusSpinner.stop("✅ Runtime version update status ensured successfully");

    const uploadStatusSpinner = prompts.spinner();
    uploadStatusSpinner.start("⬆️  Uploading runtime version update status...");

    // Preserve existing runtime version settings if they exist
    const existingRuntimeSettings = runtimeVersionUpdateStatus[runtimeVersion] || {
        isDeprecated: false,
        isForceUpdateRequired: false,
    };

    const updatedRuntimeVersionUpdateStatus = {
        ...runtimeVersionUpdateStatus,
        [runtimeVersion]: {
            isDeprecated: existingRuntimeSettings.isDeprecated,
        },
    };

    await storageClient.uploadFile({
        key: generateRuntimeVersionUpdateStatusKey(branchId),
        file: createJsonUint8Array(updatedRuntimeVersionUpdateStatus),
        contentType: "application/json",
    });

    uploadStatusSpinner.stop("✅ Runtime version update status uploaded successfully");
}

/**
 * 글로벌 런타임 버전 메타데이터를 관리합니다 (metadata.json)
 * - 전체 프로젝트에서 사용 가능한 런타임 버전 목록
 * - 파일 위치: metadata.json (루트)
 */
async function updateGlobalRuntimeVersionMetadata({
    storageClient,
    runtimeVersion,
}: {
    storageClient: StorageClient;
    runtimeVersion: string;
}): Promise<void> {
    const metadataSpinner = prompts.spinner();
    metadataSpinner.start("🔍 Ensuring global runtime version metadata...");

    const runtimeVersionMetadata = await ensureRuntimeVersionMetadata({
        storageClient,
    });

    const updatedRuntimeVersionMetadata = {
        ...runtimeVersionMetadata,
        runtimeVersions: [...new Set([...runtimeVersionMetadata.runtimeVersions, runtimeVersion])],
    };

    await storageClient.uploadFile({
        key: generateRuntimeVersionMetadataKey(),
        file: createJsonUint8Array(updatedRuntimeVersionMetadata),
        contentType: "application/json",
    });

    metadataSpinner.stop("✅ Global runtime version metadata uploaded successfully");
}

/**
 * 업데이트 요약을 출력합니다
 */
function logUpdateSummary({
    branch,
    updateId,
    runtimeVersion,
    platforms,
    message,
    gitHash,
    environment,
    privateKeyPath,
    bundlePath,
    cloudPath,
}: {
    branch: { name: string; id: string };
    updateId: string;
    runtimeVersion: string;
    platforms: Platform[];
    message: string;
    gitHash: string;
    environment?: Environment;
    privateKeyPath?: string;
    bundlePath: string;
    cloudPath: string;
}): void {
    const updateSummary = {
        branch: {
            name: branch.name,
            id: branch.id
        },
        updateId,
        runtimeVersion,
        platforms,
        message,
        gitHash,
        environment: environment || 'Not specified',
        codeSigning: {
            enabled: !!privateKeyPath,
            status: privateKeyPath ? '✅ Enabled' : '❌ Disabled'
        },
        paths: {
            bundle: bundlePath,
            cloud: cloudPath
        }
    };

    prompts.log.info("\n📊 Update Summary:");
    prompts.log.info(JSON.stringify(updateSummary, null, 2));
}

export const update = async ({
    message: defaultMessage,
    platform,
    auto,
    branch: defaultBranchName,
    channel: defaultChannelName,
    clearCache,
    environment: defaultEnvironment,
    envSource,
    inputDir,
    nonInteractive,
    privateKeyPath,
    rolloutPercentage,
    skipBundler,
}: {
    message?: string;
    platform: string;
    auto: boolean;
    branch?: string;
    channel?: string;
    clearCache: boolean;
    emitMetadata: boolean;
    environment?: string;
    envSource: string;
    inputDir: string;
    nonInteractive: boolean;
    privateKeyPath?: string;
    rolloutPercentage?: number;
    skipBundler: boolean;
}) => {


    try {
        // 1. 사전 검증 및 초기화
        await ensureGitRepository();
        const expoClient = await initializeExpoClient();

        // 2. 브랜치 및 메시지 결정
        const { message: currentMessage, branchName: currentBranchName } = await resolveBranchNameAndMessage({
            defaultMessage,
            defaultBranchName,
            auto,
            nonInteractive,
        });

        const branch = await ensureBranchChannel({
            expoClient,
            branch: currentBranchName,
            channel: defaultChannelName,
        });

        // 3. 환경 설정
        const platforms = parsePlatforms(platform) as Platform[];
        const validEnvironment = await loadEnvironment({
            defaultEnvironment,
            envSource,
            expoClient,
        });

        // 4. 번들 처리
        const bundlePath = path.resolve(getCwd(), inputDir);
        await processBundles({
            skipBundler,
            bundlePath,
            platforms,
            clearCache,
            privateKeyPath,
        });

        // 5. 업데이트 컨텍스트 생성
        const runtimeVersion = await getExpoRuntimeVersion();
        const updateId = randomUUID();
        const gitHash = await getGitCommitHash();
        const { storage: storageClient } = await loadConfig();



        // 6. 업로드 프로세스
        prompts.log.info(`📝 Git commit hash: ${gitHash}`);

        // 6-1. 번들 및 매니페스트 업로드
        const cloudPath = generateCloudPath(branch.id, updateId);

        await uploadBundleDirectory({
            storageClient,
            bundlePath,
            cloudPath,
        });

        await uploadManifests({
            storageClient,
            platforms,
            updateId,
            runtimeVersion,
            bundlePath,
            cloudPath,
        });

        // 6-2. 메타데이터 업데이트 (병렬 처리)
        await updateBranchMetadata({
            storageClient,
            branchId: branch.id,
            runtimeVersion,
            platforms,
            environment: validEnvironment,
            gitHash: gitHash || '',
            message: currentMessage || '',
            codeSigning: !!privateKeyPath,
            updateId,
        });

        await updateRuntimeVersionUpdateStatus({
            storageClient,
            branchId: branch.id,
            runtimeVersion,
        });

        await updateGlobalRuntimeVersionMetadata({
            storageClient,
            runtimeVersion,
        });


        // 7. 채널 롤아웃 (선택사항)
        if (typeof rolloutPercentage === 'number') {
            const rolloutState = await expoClient.getChannelRolloutState(branch.name);
            console.log(JSON.stringify(rolloutState, null, 2))
            await expoClient.startChannelRollout(branch.name, branch.id, rolloutPercentage, runtimeVersion);
        }

        // 8. 성공 메시지 및 요약
        prompts.log.success(`🎉 Successfully updated ${branch.name} (${branch.id}) with update ID: ${updateId}`);
        logUpdateSummary({
            branch,
            updateId,
            runtimeVersion,
            platforms,
            message: currentMessage || '',
            gitHash: gitHash || '',
            environment: validEnvironment,
            privateKeyPath,
            bundlePath,
            cloudPath,
        });

    } catch (e) {
        prompts.log.error(e instanceof Error ? e.message : String(e));
        throw e;
    }
};
