import type { CryptoAlgorithm } from "./createSignature";
import type { Platform } from "@cloud-push/cloud";
export declare const parseHeaders: ({ headers, url, }: {
    headers: Headers;
    url: URL;
}) => {
    runtimeVersion: string | null;
    platform: Platform | null;
    protocolVersion: number;
    currentUpdateId: string | null;
    channel: string | null;
    embeddedUpdateId: string | null;
    expectSignature: {
        sig: boolean;
        keyid: string;
        alg: CryptoAlgorithm;
    } | null;
};
//# sourceMappingURL=parseHeaders.d.ts.map