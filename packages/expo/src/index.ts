import type { EventSubscription } from 'expo-modules-core';
import CloudPushExpoModule, {
    type DownloadProgress,
} from './CloudPushExpoModule';

/** OTA 다운로드 진행률 리스너 */
export function addProgressListener(
    listener: (p: DownloadProgress) => void
): EventSubscription {
    return CloudPushExpoModule.addListener('downloadProgress', listener);
}

export const fetchUpdateWithProgressAsync =
    CloudPushExpoModule.fetchUpdateWithProgressAsync;
