
;// CONCATENATED MODULE: ./src/server/responses/NoUpdateResponse.ts
function NoUpdateResponse() {
    return new Response(null, {
        status: 204,
        headers: {
            "expo-protocol-version": "1"
        }
    });
}

export { NoUpdateResponse };
