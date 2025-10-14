import { convertObjectToDictionary } from "../utils/convertObjectToDictionary.js";
import form_data from "form-data";
import { serializeDictionary } from "structured-headers";

;// CONCATENATED MODULE: external "../utils/convertObjectToDictionary.js"

;// CONCATENATED MODULE: external "form-data"

;// CONCATENATED MODULE: external "structured-headers"

;// CONCATENATED MODULE: ./src/server/responses/UpdateResponse.ts



function UpdateResponse({ updateId, manifest, directive, extensions, signature }) {
    const form = new form_data();
    if (manifest) {
        form.append("manifest", JSON.stringify(manifest ?? {}), {
            contentType: "application/json",
            header: {
                "expo-signature": signature ? serializeDictionary(convertObjectToDictionary(signature)) : ""
            }
        });
    }
    if (directive) {
        form.append("directive", JSON.stringify(directive ?? {}), {
            contentType: "application/json"
        });
    }
    if (extensions) {
        form.append("extensions", JSON.stringify(extensions ?? {}), {
            contentType: "application/json"
        });
    }
    const headers = {
        "expo-protocol-version": "1",
        "expo-sfv-version": "0",
        "cache-control": "private, max-age=0",
        "content-type": `multipart/mixed; boundary=${form.getBoundary()}`,
        "expo-current-update-id": updateId,
        ...form.getHeaders()
    };
    const buffer = new Uint8Array(form.getBuffer());
    return new Response(buffer, {
        status: 200,
        headers
    });
}

export { UpdateResponse };
