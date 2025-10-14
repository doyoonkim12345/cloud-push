
;// CONCATENATED MODULE: ./src/server/responses/StatusResponse.ts
function StatusResponse({ status }) {
    const headers = {
        "cache-control": "private, max-age=0",
        "content-type": "application/json"
    };
    return new Response(JSON.stringify(status), {
        status: 200,
        headers
    });
}

export { StatusResponse };
