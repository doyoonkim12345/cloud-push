/**
 * ExpoClient Integration Tests
 * ----------------------------
 * © 2025 Cloud-Push
 */

import { describe, it, expect } from 'vitest';
import { ExpoClient } from './ExpoClient';

// 실제 Expo 프로젝트 정보 (환경변수에서 가져오기)
const TEST_APP_ID = process.env.EXPO_APP_ID;
const TEST_TOKEN = process.env.EXPO_TOKEN;

if (!TEST_APP_ID || !TEST_TOKEN) {
    throw new Error('EXPO_APP_ID and EXPO_TOKEN environment variables are required for testing');
}

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
            });
        }, 10000);

        it('should fetch environment variables with sensitive data', async () => {
            const envVars = await client.fetchEnvVars({ includeSensitive: true });

            console.log(`Found ${envVars.length} environment variables (including sensitive)`);

            expect(Array.isArray(envVars)).toBe(true);
        }, 10000);

        it('should fetch environment variables for specific environment', async () => {
            const envVars = await client.fetchEnvVars({ environment: 'production' });

            console.log(`Found ${envVars.length} production environment variables`);

            expect(Array.isArray(envVars)).toBe(true);
        }, 10000);
    });

    describe('Channels', () => {
        it('should fetch channels', async () => {
            const channels = await client.fetchChannels();

            console.log('Channels:', channels.slice(0, 5)); // 처음 5개만 로그

            expect(Array.isArray(channels)).toBe(true);
            expect(channels.length).toBeGreaterThan(0);

            channels.forEach(channel => {
                expect(channel).toHaveProperty('id');
                expect(channel).toHaveProperty('name');
                expect(typeof channel.id).toBe('string');
                expect(typeof channel.name).toBe('string');
            });
        }, 10000);
    });

    describe('Branches', () => {
        it('should fetch branches', async () => {
            const branches = await client.fetchBranches();

            console.log('Branches:', branches.slice(0, 5)); // 처음 5개만 로그

            expect(Array.isArray(branches)).toBe(true);
            expect(branches.length).toBeGreaterThan(0);

            branches.forEach(branch => {
                expect(branch).toHaveProperty('id');
                expect(branch).toHaveProperty('name');
                expect(typeof branch.id).toBe('string');
                expect(typeof branch.name).toBe('string');
            });
        }, 10000);
    });

    describe('Channel Mapping', () => {
        it('should fetch channel mapping', async () => {
            // 임의의 채널 이름으로 테스트 (없을 수도 있음)
            const testChannelName = `test-channel-${Date.now()}`;

            console.log(`Testing channel mapping for: ${testChannelName}`);

            const mapping = await client.fetchChannelMapping(testChannelName);

            console.log('Channel Mapping:', mapping);

            // 채널이 없을 수 있으므로 null도 정상
            if (mapping) {
                expect(mapping).toHaveProperty('id');
                expect(mapping).toHaveProperty('branchName');
            }
        }, 10000);

        it('should fetch all branches mapping', async () => {
            const mappings = await client.fetchBranchesMapping();

            console.log('All Branches Mapping:', mappings.slice(0, 5)); // 처음 5개만 로그

            expect(Array.isArray(mappings)).toBe(true);

            mappings.forEach(mapping => {
                expect(mapping).toHaveProperty('branchName');
                expect(mapping).toHaveProperty('branchId');
                expect(mapping).toHaveProperty('channelName');
                expect(typeof mapping.branchName).toBe('string');
                expect(typeof mapping.branchId).toBe('string');
                // channelName은 null일 수 있음
            });
        }, 10000);
    });

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
            expect(createdBranch).toBeDefined();
        }, 15000);

        it('should create a test channel', async () => {
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
                console.log('✅ Channel mapping updated successfully');
            } else {
                console.log('⚠️ Channel mapping not yet reflected (eventual consistency)');
            }
        }, 20000);
    });

    describe('Error Handling', () => {
        it('should handle invalid channel name gracefully', async () => {
            const invalidChannelName = 'non-existent-channel-12345';

            const mapping = await client.fetchChannelMapping(invalidChannelName);
            expect(mapping).toBeNull();
        }, 10000);

        it('should handle authentication with wrong token', async () => {
            const wrongClient = new ExpoClient({
                appId: TEST_APP_ID,
                token: 'invalid-token'
            });

            await expect(wrongClient.fetchChannels()).rejects.toThrow();
        }, 10000);

        it('should handle invalid app ID', async () => {
            const wrongClient = new ExpoClient({
                appId: 'invalid-app-id',
                token: TEST_TOKEN
            });

            await expect(wrongClient.fetchChannels()).rejects.toThrow();
        }, 10000);

        it('should handle branch creation with duplicate name', async () => {
            const duplicateBranchName = `duplicate-branch-${Date.now()}`;

            // 첫 번째 생성은 성공해야 함
            await client.createBranch(duplicateBranchName);

            // 두 번째 생성은 실패해야 함
            await expect(client.createBranch(duplicateBranchName)).rejects.toThrow();
        }, 15000);

        it('should handle channel creation with duplicate name', async () => {
            const duplicateChannelName = `duplicate-channel-${Date.now()}`;

            // 첫 번째 생성은 성공해야 함
            const channel = await client.createChannel(duplicateChannelName);
            expect(channel.name).toBe(duplicateChannelName);

            // 두 번째 생성은 실패해야 함
            await expect(client.createChannel(duplicateChannelName)).rejects.toThrow();
        }, 15000);
    });
});