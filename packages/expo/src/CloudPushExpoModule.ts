import { requireNativeModule } from 'expo-modules-core';
import type { EventSubscription } from 'expo-modules-core';

/* ───────── 이벤트 payload ───────── */
export type DownloadProgress = {
    receivedBytes: number;
    totalBytes: number;
};

/* ───────── Native 모듈 API & Event hook ───────── */
export interface CloudPushExpoModuleSpec {
    fetchUpdateWithProgressAsync(): Promise<{
        isNew: boolean;
        manifest?: Record<string, unknown>;
    }>;

    /** JS-side listener hooks (Expo Modules Core v2) */
    addListener(
        eventName: string,
        listener: (...args: any[]) => void
    ): EventSubscription;
    removeSubscription(subscription: EventSubscription): void;
}

/* ───────── 권장 방식: requireNativeModule ───────── */
const CloudPushExpoModule =
    requireNativeModule<CloudPushExpoModuleSpec>('CloudPushExpoModule');

export default CloudPushExpoModule;
