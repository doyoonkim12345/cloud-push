import type { ExpoBranch, ExpoClient } from "@cloud-push/cloud";
import { getBranch } from "../prompts/getBranch";

export async function ensureBranchChannel({
    expoClient,
    branch: defaultBranch,
    channel: defaultChannel,
}: {
    expoClient: ExpoClient;
    branch?: string;
    channel?: string;
}): Promise<ExpoBranch> {
    const currentBranch = defaultBranch?.trim();
    const currentChannel = defaultChannel?.trim();

    let branches = await expoClient.fetchBranches();
    let branchMappings = await expoClient.fetchBranchesMapping();


    if (currentChannel && currentBranch) {
        throw new Error("Channel and branch cannot be specified at the same time");
    }

    if (currentChannel) {
        const channels = await expoClient.fetchChannels()
        let channel = channels.find(channel => channel.name === currentChannel)
        if (!channel) {
            channel = await expoClient.createChannel(currentChannel)
        }
        const branchMapping = branchMappings.find((e) => e.channelName === channel.name)
        if (!branchMapping) {
            let branch = branches.find(branch => branch.name === currentChannel)
            if (!branch) {
                await expoClient.createBranch(channel.name)
            }
            branches = await expoClient.fetchBranches()
            branch = branches.find(branch => branch.name === currentChannel)
            if (!branch) {
                throw new Error(`Branch ${currentChannel} not found`);
            }
            await expoClient.updateChannelBranch(channel.id, branch.id)
            return branch
        }
        return {
            id: branchMapping.branchId,
            name: branchMapping.branchName
        }
    }

    if (currentBranch) {
        let branch = branches.find(branch => branch.name === currentBranch);
        if (!branch) {
            await expoClient.createBranch(currentBranch);
            branches = await expoClient.fetchBranches()
        }
        branch = branches.find(branch => branch.name === currentBranch)
        if (!branch) {
            throw new Error(`Branch ${currentBranch} not found`);
        }
        return branch;
    }

    const newBranch = await getBranch({ branches })
    const existingBranch = branches.find(branch => branch.name === newBranch)
    if (existingBranch) {
        return existingBranch
    }
    await expoClient.createBranch(newBranch)
    branches = await expoClient.fetchBranches()
    const branch = branches.find(branch => branch.name === newBranch)
    if (!branch) {
        throw new Error(`Branch ${newBranch} not found`);
    }
    return branch;
}
