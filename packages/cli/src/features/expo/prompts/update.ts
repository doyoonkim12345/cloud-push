import { type Environment, ExpoBranch, ExpoClient, } from "@cloud-push/cloud";
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
import { loadConfig } from "../lib/loadConfig";
import { getExpoRuntimeVersion } from "../features/expo/lib/getExpoRuntimeVersion";
import { createManifest } from "@/lib/createManifest";
import { randomUUID } from "node:crypto";
import { getCwd } from "@/lib/getCwd";
import { exportExpoConfig } from "../features/expo/prompts/exportExpoConfig";
import { ensureBranchMetadata } from "../features/metadata/lib/ensureBranchMetadata";
import { generatePush } from "../features/metadata/lib/generatePush";
import { getGitCommitHash } from "../features/git/prompts/getGitCommitHash";
import { createJsonUint8Array } from "@/lib/createJsonUint8Array";
import { parsePlatforms } from "../features/expo/lib/parsePlatforms";
import { ensureBranchChannel, } from "../features/expo/lib/ensureBranchChannel";

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
    rolloutPercentage: number;
    skipBundler: boolean;
}) => {
    // 0) Git 리포지토리 확인
    await ensureGitRepository();

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

    // 2) 브랜치/메시지 결정 (resolveBranchNameAndMessage 인라인)
    const gitBranch = (await getGitBranch()) ?? "";
    const gitMessage = (await getGitCommitMessage()) ?? "";

    let currentMessage = defaultMessage;
    let currentBranchName = defaultBranchName;
    const currentChannelName = defaultChannelName;

    if (auto) {
        currentMessage = currentMessage ?? gitMessage;
        currentBranchName = currentBranchName ?? gitBranch;
    }

    if (nonInteractive) {
        if (!currentBranchName || !currentMessage) {
            throw new Error(
                "--branch and --message, or --channel and --message are required when updating in non-interactive mode unless --auto is specified"
            );
        }
    } else {
        const updatedMessage = (await getMessage(currentMessage)) ?? "";
        currentMessage = currentMessage ?? updatedMessage;
    }


    const branch = await ensureBranchChannel({
        expoClient,
        branch: currentBranchName,
        channel: currentChannelName,
    });

    const platforms = parsePlatforms(platform); // Platform[]

    // 3) 환경변수 로딩 (loadEnvironment 인라인)
    const validEnvironment: Environment | undefined = ["development", "preview", "production"].includes(
        defaultEnvironment ?? ""
    )
        ? (defaultEnvironment as Environment)
        : undefined;

    if (validEnvironment) {
        if (envSource === "eas" && expoClient) {
            await loadExpoEnv({ environment: validEnvironment, expoClient });
        } else if (envSource === "dotenv") {
            await loadFileEnv(validEnvironment);
        }
    }

    // 4) 번들 경로 계산
    const bundlePath = path.resolve(getCwd(), inputDir);

    // 5) 번들 생성/서명 (processBundles 인라인)
    if (!skipBundler) {
        await exportBundles({ bundlePath, platforms, isClearCache: clearCache });
        if (privateKeyPath) {
            signBundle({ privateKeyPath });
        }
    }

    // 7) 런타임 버전 및 업데이트 ID
    const runtimeVersion = await getExpoRuntimeVersion();
    const updateId = randomUUID();

    // 8) 업로드 경로 준비
    const branchPath = path.join(branch.id);
    const cloudPath = path.join(branch.id, updateId);

    // 9) 스토리지 클라이언트 로딩
    const { storage: storageClient } = await loadConfig();

    // 10) expo config 내보내기 (번들 폴더로)
    const configSpinner = prompts.spinner();
    configSpinner.start("📝 Exporting Expo config...");

    const expoConfig = await getExpoConfig();
    await exportExpoConfig({ expoConfigPath: bundlePath });

    configSpinner.stop("✅ Expo config exported successfully");

    // 11) 전체 디렉터리 업로드
    const directorySpinner = prompts.spinner();
    directorySpinner.start("📦 Uploading bundle directory...");

    await storageClient.uploadDirectory({ cloudPath, directoryPath: bundlePath });

    directorySpinner.stop("✅ Bundle directory uploaded successfully");

    // 12) 각 플랫폼별 manifest 생성/업로드
    const manifestSpinner = prompts.spinner();
    manifestSpinner.start(`📋 Generating and uploading manifests for ${platforms.join(', ')}...`);

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

        const localManifestPath = path.join(bundlePath, `manifest-${plt}.json`);
        await fs.writeFile(localManifestPath, JSON.stringify(manifest, null, 2));

        await storageClient.uploadFile({
            key: path.join(cloudPath, `manifest-${plt}.json`),
            file: await fs.readFile(localManifestPath),
            contentType: "application/json",
        });
    }

    manifestSpinner.stop(`✅ Manifests for ${platforms.join(', ')} uploaded successfully`);

    // 13) 브랜치 메타데이터 보장/갱신
    const branchMetadataSpinner = prompts.spinner();
    branchMetadataSpinner.start("🔍 Ensuring branch metadata...");

    const branchMetadata = await ensureBranchMetadata({
        storageClient,
        branchId: branch.id,
    });

    branchMetadataSpinner.stop("✅ Branch metadata ensured successfully");

    const gitHash = await getGitCommitHash();
    prompts.log.info(`📝 Git commit hash: ${gitHash}`);

    // Generate push metadata with spinner
    const metadataSpinner = prompts.spinner();
    metadataSpinner.start("🔄 Generating push metadata...");

    const updatedBranchMetadata = {
        ...branchMetadata,
        pushes: [
            generatePush({
                runtimeVersion,
                platforms,
                environment: validEnvironment,
                gitHash,
                message: currentMessage,
                codeSigning: !!privateKeyPath,
                id: updateId,
            }),
            ...branchMetadata.pushes,
        ],
    };

    metadataSpinner.stop("✅ Push metadata generated successfully");

    // Upload branch metadata with spinner
    const uploadSpinner = prompts.spinner();
    uploadSpinner.start("⬆️  Uploading branch metadata...");

    await storageClient.uploadFile({
        key: path.join(branchPath, `metadata.json`),
        file: createJsonUint8Array(updatedBranchMetadata),
        contentType: "application/json",
    });

    uploadSpinner.stop("✅ Branch metadata uploaded successfully");

    prompts.log.success(`🎉 Successfully updated ${branch.name} (${branch.id}) with update ID: ${updateId}`);

    // 업데이트 정보 요약 출력
    prompts.log.info("\n📊 Update Summary:");
    prompts.log.info(`┌─ Branch: ${branch.name} (${branch.id})`);
    prompts.log.info(`├─ Update ID: ${updateId}`);
    prompts.log.info(`├─ Runtime Version: ${runtimeVersion}`);
    prompts.log.info(`├─ Platforms: ${platforms.join(', ')}`);
    prompts.log.info(`├─ Message: ${currentMessage}`);
    prompts.log.info(`├─ Git Hash: ${gitHash}`);
    prompts.log.info(`├─ Environment: ${validEnvironment || 'Not specified'}`);
    prompts.log.info(`├─ Code Signing: ${privateKeyPath ? '✅ Enabled' : '❌ Disabled'}`);
    prompts.log.info(`├─ Bundle Path: ${bundlePath}`);
    prompts.log.info(`└─ Cloud Path: ${cloudPath}`);


};
