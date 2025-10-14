import type { Directive, Extensions, Manifest } from "../types";
export declare function UpdateResponse({ updateId, manifest, directive, extensions, signature, }: {
    updateId: string;
    manifest?: Manifest;
    directive?: Directive;
    extensions?: Extensions;
    signature?: {
        sig: string;
        keyid: string;
    };
}): Response;
//# sourceMappingURL=UpdateResponse.d.ts.map