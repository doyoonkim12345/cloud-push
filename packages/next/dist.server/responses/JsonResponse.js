
;// CONCATENATED MODULE: ./src/server/responses/JsonResponse.ts
function JsonResponse(data) {
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}

export { JsonResponse };
