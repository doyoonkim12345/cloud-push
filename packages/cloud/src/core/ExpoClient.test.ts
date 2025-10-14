/**
<<<<<<< Updated upstream
 * ExpoClient Integration Tests
 * ----------------------------
 * © 2025 Cloud-Push
 */

import { describe, it, expect } from 'vitest';
import { ExpoClient } from './ExpoClient';

// 실제 Expo 프로젝트 정보 (환경변수에서 가져오기)
const TEST_APP_ID = process.env.EXPO_APP_ID;
const TEST_TOKEN = process.env.EXPO_TOKEN;
=======
 * ExpoClient Integration Tests (with Rollout flows)
 * -------------------------------------------------
 * © 2025 Cloud-Push
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { ExpoClient } from './ExpoClient';

// 실제 Expo 프로젝트 정보 (환경변수에서 가져오기)
const TEST_APP_ID = process.env.EXPO_APP_ID
const TEST_TOKEN = process.env.EXPO_TOKEN
const TEST_RUNTIME_VERSION = process.env.EXPO_TEST_RUNTIME_VERSION || '1.0.0';
>>>>>>> Stashed changes

if (!TEST_APP_ID || !TEST_TOKEN) {
    throw new Error('EXPO_APP_ID and EXPO_TOKEN environment variables are required for testing');
}

<<<<<<< Updated upstream
describe('ExpoClient Integration Tests', () => {
    const client = new ExpoClient({
        appId: TEST_APP_ID,
        token: TEST_TOKEN
    });

    describe('Environment Variables', () => {
        it('should fetch environment variables', async () => {
            const envVars = await client.fetchEnvVars();

            console.log('Environment Variables:', envVars.slice(0, 3)); // 처음 3개만 로그

            expect(Array.isArray(envVars)).toBe(true);
            envVars.forEach(envVar => {
                expect(envVar).toHaveProperty('id');
                expect(envVar).toHaveProperty('name');
                expect(envVar).toHaveProperty('type');
                expect(['PLAIN', 'SECRET', 'FILE', 'STRING']).toContain(envVar.type);
=======
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('ExpoClient Integration Tests', () => {
    const client = new ExpoClient({ appId: TEST_APP_ID!, token: TEST_TOKEN! });

    let createdBranchName: string | undefined;
    let createdChannelName: string | undefined;
    let createdChannelId: string | undefined;

    // ────────────────────────────────────────────────────────────────────────────
    describe('Environment Variables', () => {
        it('should fetch environment variables', async () => {
            const envVars = await client.fetchEnvVars();
            console.log('Environment Variables:', envVars.slice(0, 3));
            expect(Array.isArray(envVars)).toBe(true);
            envVars.forEach((envVar) => {
                expect(envVar).toHaveProperty('id');
                expect(envVar).toHaveProperty('name');
                expect(envVar).toHaveProperty('type');
                expect(['PLAIN', 'SECRET', 'FILE', 'STRING']).toContain((envVar as any).type);
>>>>>>> Stashed changes
            });
        }, 10000);

        it('should fetch environment variables with sensitive data', async () => {
            const envVars = await client.fetchEnvVars({ includeSensitive: true });
<<<<<<< Updated upstream

            console.log(`Found ${envVars.length} environment variables (including sensitive)`);

=======
            console.log(`Found ${envVars.length} environment variables (including sensitive)`);
>>>>>>> Stashed changes
            expect(Array.isArray(envVars)).toBe(true);
        }, 10000);

        it('should fetch environment variables for specific environment', async () => {
            const envVars = await client.fetchEnvVars({ environment: 'production' });
<<<<<<< Updated upstream

            console.log(`Found ${envVars.length} production environment variables`);

=======
            console.log(`Found ${envVars.length} production environment variables`);
>>>>>>> Stashed changes
            expect(Array.isArray(envVars)).toBe(true);
        }, 10000);
    });

<<<<<<< Updated upstream
    describe('Channels', () => {
        it('should fetch channels', async () => {
            const channels = await client.fetchChannels();

            console.log('Channels:', channels.slice(0, 5)); // 처음 5개만 로그

            expect(Array.isArray(channels)).toBe(true);
            expect(channels.length).toBeGreaterThan(0);

            channels.forEach(channel => {
=======
    // ────────────────────────────────────────────────────────────────────────────
    describe('Channels', () => {
        it('should fetch channels', async () => {
            const channels = await client.fetchChannels();
            console.log('Channels:', channels.slice(0, 5));
            expect(Array.isArray(channels)).toBe(true);
            expect(channels.length).toBeGreaterThan(0);
            channels.forEach((channel) => {
>>>>>>> Stashed changes
                expect(channel).toHaveProperty('id');
                expect(channel).toHaveProperty('name');
                expect(typeof channel.id).toBe('string');
                expect(typeof channel.name).toBe('string');
            });
        }, 10000);
    });

<<<<<<< Updated upstream
    describe('Branches', () => {
        it('should fetch branches', async () => {
            const branches = await client.fetchBranches();

            console.log('Branches:', branches.slice(0, 5)); // 처음 5개만 로그

            expect(Array.isArray(branches)).toBe(true);
            expect(branches.length).toBeGreaterThan(0);

            branches.forEach(branch => {
=======
    // ────────────────────────────────────────────────────────────────────────────
    describe('Branches', () => {
        it('should fetch branches', async () => {
            const branches = await client.fetchBranches();
            console.log('Branches:', branches.slice(0, 5));
            expect(Array.isArray(branches)).toBe(true);
            expect(branches.length).toBeGreaterThan(0);
            branches.forEach((branch) => {
>>>>>>> Stashed changes
                expect(branch).toHaveProperty('id');
                expect(branch).toHaveProperty('name');
                expect(typeof branch.id).toBe('string');
                expect(typeof branch.name).toBe('string');
            });
        }, 10000);
    });

<<<<<<< Updated upstream
    describe('Channel Mapping', () => {
        it('should fetch channel mapping', async () => {
            // 임의의 채널 이름으로 테스트 (없을 수도 있음)
            const testChannelName = `test-channel-${Date.now()}`;

            console.log(`Testing channel mapping for: ${testChannelName}`);

            const mapping = await client.fetchChannelMapping(testChannelName);

            console.log('Channel Mapping:', mapping);

            // 채널이 없을 수 있으므로 null도 정상
=======
    // ────────────────────────────────────────────────────────────────────────────
    describe('Channel Mapping', () => {
        it('should fetch channel mapping for a random name (may be null)', async () => {
            const testChannelName = `test-channel-${Date.now()}`;
            console.log(`Testing channel mapping for: ${testChannelName}`);
            const mapping = await client.fetchChannelMapping(testChannelName);
            console.log('Channel Mapping:', mapping);
>>>>>>> Stashed changes
            if (mapping) {
                expect(mapping).toHaveProperty('id');
                expect(mapping).toHaveProperty('branchName');
            }
        }, 10000);

        it('should fetch all branches mapping', async () => {
            const mappings = await client.fetchBranchesMapping();
<<<<<<< Updated upstream

            console.log('All Branches Mapping:', mappings.slice(0, 5)); // 처음 5개만 로그

            expect(Array.isArray(mappings)).toBe(true);

            mappings.forEach(mapping => {
                expect(mapping).toHaveProperty('branchName');
                expect(mapping).toHaveProperty('branchId');
                expect(mapping).toHaveProperty('channelName');
                expect(typeof mapping.branchName).toBe('string');
                expect(typeof mapping.branchId).toBe('string');
                // channelName은 null일 수 있음
=======
            console.log('All Branches Mapping:', mappings.slice(0, 5));
            expect(Array.isArray(mappings)).toBe(true);
            mappings.forEach((m) => {
                expect(m).toHaveProperty('branchName');
                expect(m).toHaveProperty('branchId');
                expect(m).toHaveProperty('channelName');
                expect(typeof m.branchName).toBe('string');
                expect(typeof m.branchId).toBe('string');
>>>>>>> Stashed changes
            });
        }, 10000);
    });

<<<<<<< Updated upstream
    describe('Branch and Channel Creation (Careful!)', () => {
        let testBranchName: string;
        let testChannelName: string;
        let testChannelId: string;

        it('should create a test branch', async () => {
            testBranchName = `test-branch-${Date.now()}`;

            console.log(`Creating test branch: ${testBranchName}`);

            await client.createBranch(testBranchName);

            console.log(`Successfully created branch: ${testBranchName}`);

            // 브랜치가 실제로 생성되었는지 확인
            const branches = await client.fetchBranches();
            const createdBranch = branches.find(b => b.name === testBranchName);
=======
    // ────────────────────────────────────────────────────────────────────────────
    describe('Branch and Channel Creation (Careful!)', () => {
        it('should create a test branch', async () => {
            createdBranchName = `test-branch-${Date.now()}`;
            console.log(`Creating test branch: ${createdBranchName}`);
            await client.createBranch(createdBranchName);
            console.log(`Successfully created branch: ${createdBranchName}`);
            const branches = await client.fetchBranches();
            const createdBranch = branches.find((b) => b.name === createdBranchName);
>>>>>>> Stashed changes
            expect(createdBranch).toBeDefined();
        }, 15000);

        it('should create a test channel', async () => {
<<<<<<< Updated upstream
            testChannelName = `test-channel-${Date.now()}`;

            console.log(`Creating test channel: ${testChannelName}`);

            const channel = await client.createChannel(testChannelName);
            testChannelId = channel.id;

            console.log(`Successfully created channel: ${testChannelName} with ID: ${testChannelId}`);

            expect(channel).toHaveProperty('id');
            expect(channel).toHaveProperty('name');
            expect(channel.name).toBe(testChannelName);
        }, 15000);

        it('should update channel branch mapping', async () => {
            if (!testChannelId || !testBranchName) {
                throw new Error('Previous tests must run first');
            }

            // 생성된 브랜치 ID 찾기
            const branches = await client.fetchBranches();
            const testBranch = branches.find(b => b.name === testBranchName);
            if (!testBranch) {
                throw new Error(`Could not find created branch: ${testBranchName}`);
            }

            console.log(`Updating channel ${testChannelName} to branch ${testBranchName}`);

            await client.updateChannelBranch(testChannelId, testBranch.id);

            console.log('Successfully updated channel branch mapping');

            // 잠시 대기 후 매핑 확인 (eventual consistency)
            await new Promise(resolve => setTimeout(resolve, 3000));

            const mapping = await client.fetchChannelMapping(testChannelName);
            if (mapping && mapping.branchName === testBranchName) {
=======
            createdChannelName = `test-channel-${Date.now()}`;
            console.log(`Creating test channel: ${createdChannelName}`);
            const channel = await client.createChannel(createdChannelName);
            createdChannelId = channel.id;
            console.log(`Successfully created channel: ${createdChannelName} (ID: ${createdChannelId})`);
            expect(channel).toHaveProperty('id');
            expect(channel).toHaveProperty('name');
            expect(channel.name).toBe(createdChannelName);
        }, 15000);

        it('should update channel branch mapping to the created branch', async () => {
            if (!createdChannelId || !createdBranchName) throw new Error('Previous tests must run first');
            const branches = await client.fetchBranches();
            const testBranch = branches.find((b) => b.name === createdBranchName);
            if (!testBranch) throw new Error(`Could not find created branch: ${createdBranchName}`);

            console.log(`Updating channel ${createdChannelName} to branch ${createdBranchName}`);
            await client.updateChannelBranch(createdChannelId, testBranch.id);
            console.log('Successfully updated channel branch mapping');

            // eventual consistency
            await sleep(3000);

            const mapping = await client.fetchChannelMapping(createdChannelName!);
            if (mapping && mapping.branchName === createdBranchName) {
>>>>>>> Stashed changes
                console.log('✅ Channel mapping updated successfully');
            } else {
                console.log('⚠️ Channel mapping not yet reflected (eventual consistency)');
            }
        }, 20000);
    });

<<<<<<< Updated upstream
    describe('Error Handling', () => {
        it('should handle invalid channel name gracefully', async () => {
            const invalidChannelName = 'non-existent-channel-12345';

=======
    // ────────────────────────────────────────────────────────────────────────────
    describe('Rollout (start → update → end)', () => {
        let defaultBranchId: string | undefined;
        let rolloutBranchId: string | undefined;

        beforeAll(async () => {
            // Ensure we have a default branch mapped to the created channel
            if (!createdChannelName) throw new Error('Channel was not created');
            const branches = await client.fetchBranches();

            // default branch is the one we just created and mapped in the previous block
            const defaultBranch = branches.find((b) => b.name === createdBranchName);
            if (!defaultBranch) throw new Error('Default branch for channel not found');
            defaultBranchId = defaultBranch.id;

            // create a rollout target branch
            const rbName = `test-rollout-branch-${Date.now()}`;
            await client.createBranch(rbName);
            const rb = (await client.fetchBranches()).find((b) => b.name === rbName);
            if (!rb) throw new Error('Failed to create rollout branch');
            rolloutBranchId = rb.id;
        });

        it('should start constrained rollout on the test channel', async () => {
            if (!createdChannelName || !rolloutBranchId) throw new Error('Setup incomplete');

            console.log('\n🚀 Starting rollout test...');
            console.log(`Channel: ${createdChannelName}`);
            console.log(`Default Branch ID: ${defaultBranchId}`);
            console.log(`Rollout Branch ID: ${rolloutBranchId}`);

            const info = await client.startChannelRollout(
                createdChannelName,
                rolloutBranchId,
                10,
                TEST_RUNTIME_VERSION
            );
            console.log('✅ Rollout started:', info);
            expect(info.percent).toBe(10);
            expect(info.runtimeVersion).toBe(TEST_RUNTIME_VERSION);

            await sleep(2000);

            const state = await client.getChannelRolloutState(createdChannelName);
            console.log('\n📊 Current Rollout State:');
            console.log(`  Kind: ${state.kind}`);
            if (state.kind === 'constrained') {
                console.log(`  🎯 Rollout Branch: ${rolloutBranchId} → ${state.percent}%`);
                console.log(`  🔄 Default Branch: ${defaultBranchId} → ${100 - state.percent}%`);
                console.log(`  📱 Runtime Version: ${state.runtimeVersion}`);
                expect(state.runtimeVersion).toBe(TEST_RUNTIME_VERSION);
                expect(state.percent).toBe(10);
            }

            expect(state.kind).toBe('constrained');
        }, 25000);

        it('should update rollout percent', async () => {
            if (!createdChannelName) throw new Error('Channel not set');

            console.log('\n📈 Updating rollout percentage from 10% to 30%...');
            await client.updateChannelRolloutPercent(createdChannelName, 30);
            await sleep(1500);

            const state = await client.getChannelRolloutState(createdChannelName);
            console.log('\n📊 Updated Rollout State:');
            console.log(`  Kind: ${state.kind}`);
            if (state.kind === 'constrained') {
                console.log(`  🎯 Rollout Branch: ${rolloutBranchId} → ${state.percent}%`);
                console.log(`  🔄 Default Branch: ${defaultBranchId} → ${100 - state.percent}%`);
                console.log(`  📱 Runtime Version: ${state.runtimeVersion}`);
                expect(state.percent).toBe(30);
            }
            expect(state.kind).toBe('constrained');
        }, 20000);

        it('should end rollout by rolling back to default branch', async () => {
            if (!createdChannelName || !defaultBranchId) throw new Error('Setup incomplete');

            console.log('\n🔙 Ending rollout by rolling back to default branch...');
            await client.endChannelRollout(createdChannelName, { promoteNewBranch: false });
            await sleep(1500);

            const m = await client.getChannelMapping(createdChannelName);
            console.log('\n📊 Final State After Rollback:');
            expect(m).not.toBeNull();
            if (m) {
                const parsed = m.branchMapping;
                console.log(`  🎯 Active Branch: ${defaultBranchId} → 100%`);
                console.log(`  📝 Mapping Logic: ${parsed.data[0].branchMappingLogic}`);
                console.log(`  📊 Total mappings: ${parsed.data.length}`);
                expect(parsed.data.length).toBe(1);
                expect(parsed.data[0].branchMappingLogic).toBe('true');
                expect(parsed.data[0].branchId).toBe(defaultBranchId);
            }
        }, 20000);

        it('should start again and then end rollout by promoting new branch', async () => {
            if (!createdChannelName || !rolloutBranchId) throw new Error('Setup incomplete');

            console.log('\n🚀 Starting new rollout (20%) and then promoting...');

            // start 20%
            await client.startChannelRollout(createdChannelName, rolloutBranchId, 20, TEST_RUNTIME_VERSION);
            await sleep(1500);

            const rolloutState = await client.getChannelRolloutState(createdChannelName);
            console.log('\n📊 Rollout State Before Promotion:');
            if (rolloutState.kind === 'constrained') {
                console.log(`  🎯 Rollout Branch: ${rolloutBranchId} → ${rolloutState.percent}%`);
                console.log(`  🔄 Default Branch: ${defaultBranchId} → ${100 - rolloutState.percent}%`);
            }

            // promote new branch → standard mapping to rolloutBranchId
            console.log('\n✅ Promoting rollout branch to 100%...');
            await client.endChannelRollout(createdChannelName, { promoteNewBranch: true });
            await sleep(1500);

            const m = await client.getChannelMapping(createdChannelName);
            console.log('\n📊 Final State After Promotion:');
            expect(m).not.toBeNull();
            if (m) {
                const parsed = m.branchMapping;
                console.log(`  🎯 Active Branch: ${rolloutBranchId} → 100%`);
                console.log(`  📝 Mapping Logic: ${parsed.data[0].branchMappingLogic}`);
                console.log(`  📊 Total mappings: ${parsed.data.length}`);
                expect(parsed.data.length).toBe(1);
                expect(parsed.data[0].branchMappingLogic).toBe('true');
                expect(parsed.data[0].branchId).toBe(rolloutBranchId);
            }
        }, 25000);
    });

    // ────────────────────────────────────────────────────────────────────────────
    describe('Error Handling', () => {
        it('should handle invalid channel name gracefully', async () => {
            const invalidChannelName = 'non-existent-channel-12345';
>>>>>>> Stashed changes
            const mapping = await client.fetchChannelMapping(invalidChannelName);
            expect(mapping).toBeNull();
        }, 10000);

        it('should handle authentication with wrong token', async () => {
<<<<<<< Updated upstream
            const wrongClient = new ExpoClient({
                appId: TEST_APP_ID,
                token: 'invalid-token'
            });

=======
            const wrongClient = new ExpoClient({ appId: TEST_APP_ID!, token: 'invalid-token' });
>>>>>>> Stashed changes
            await expect(wrongClient.fetchChannels()).rejects.toThrow();
        }, 10000);

        it('should handle invalid app ID', async () => {
<<<<<<< Updated upstream
            const wrongClient = new ExpoClient({
                appId: 'invalid-app-id',
                token: TEST_TOKEN
            });

=======
            const wrongClient = new ExpoClient({ appId: 'invalid-app-id', token: TEST_TOKEN! });
>>>>>>> Stashed changes
            await expect(wrongClient.fetchChannels()).rejects.toThrow();
        }, 10000);

        it('should handle branch creation with duplicate name', async () => {
            const duplicateBranchName = `duplicate-branch-${Date.now()}`;
<<<<<<< Updated upstream

            // 첫 번째 생성은 성공해야 함
            await client.createBranch(duplicateBranchName);

            // 두 번째 생성은 실패해야 함
            await expect(client.createBranch(duplicateBranchName)).rejects.toThrow();
=======
            await client.createBranch(duplicateBranchName); // first ok
            await expect(client.createBranch(duplicateBranchName)).rejects.toThrow(); // second fails
>>>>>>> Stashed changes
        }, 15000);

        it('should handle channel creation with duplicate name', async () => {
            const duplicateChannelName = `duplicate-channel-${Date.now()}`;
<<<<<<< Updated upstream

            // 첫 번째 생성은 성공해야 함
            const channel = await client.createChannel(duplicateChannelName);
            expect(channel.name).toBe(duplicateChannelName);

            // 두 번째 생성은 실패해야 함
            await expect(client.createChannel(duplicateChannelName)).rejects.toThrow();
        }, 15000);
    });
});
=======
            const channel = await client.createChannel(duplicateChannelName);
            expect(channel.name).toBe(duplicateChannelName);
            await expect(client.createChannel(duplicateChannelName)).rejects.toThrow();
        }, 15000);
    });
});
>>>>>>> Stashed changes
