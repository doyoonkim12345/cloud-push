import { ErrorResponse } from "../responses/ErrorResponse";
import { JsonResponse } from "../responses/JsonResponse";
import type { ExpoClient } from "@cloud-push/cloud";

export async function getBranches({ expoClient }: { expoClient: ExpoClient }) {
    try {
        const branches = await expoClient.fetchBranches()
        return JsonResponse(branches)
    } catch (e) {
        return ErrorResponse(e as Error);
    }
}