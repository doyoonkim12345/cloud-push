import node_crypto from "node:crypto";

;// CONCATENATED MODULE: external "node:crypto"

;// CONCATENATED MODULE: ./src/server/utils/createSignature.ts

const cryptoAlgorithm = {
    "rsa-v1_5-sha256": "RSA-SHA256",
    "rsa-v1_5-sha512": "RSA-SHA512",
    "rsa-pss-sha256": "RSA-PSS-SHA256",
    "ecdsa-p256-sha256": "ECDSA-SHA256",
    ed25519: "ED25519"
};
function createSignature(alg, data, privateKey) {
    const sign = node_crypto.createSign(cryptoAlgorithm[alg]);
    sign.update(data, "utf8");
    sign.end();
    return sign.sign(privateKey.replace(/\\n/g, "\n"), "base64");
}

export { createSignature };
