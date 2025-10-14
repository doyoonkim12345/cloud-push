export type CryptoAlgorithm = "rsa-v1_5-sha256" | "rsa-v1_5-sha512" | "rsa-pss-sha256" | "ecdsa-p256-sha256" | "ed25519";
export declare function createSignature(alg: CryptoAlgorithm, data: string, privateKey: string): string;
//# sourceMappingURL=createSignature.d.ts.map