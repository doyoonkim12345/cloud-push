import { ErrorResponse } from "../responses/ErrorResponse.js";
import { JsonResponse } from "../responses/JsonResponse.js";

;// CONCATENATED MODULE: external "../responses/ErrorResponse.js"

;// CONCATENATED MODULE: external "../responses/JsonResponse.js"

;// CONCATENATED MODULE: ./src/server/apis/branches.ts


async function getBranches({ expoClient }) {
    try {
        const branches = await expoClient.fetchBranches();
        return JsonResponse(branches);
    } catch (e) {
        return ErrorResponse(e);
    }
}

export { getBranches };
