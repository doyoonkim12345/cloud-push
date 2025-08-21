import type { Platform } from "@cloud-push/cloud";

export const parsePlatforms = (platform: string): Platform[] => {
    if (platform === 'all') {
        return ['android', 'ios']
    } else if (['android', 'ios'].includes(platform)) {
        return [platform as Platform]
    } else {
        throw new Error("Invalid platform");
    }
}
