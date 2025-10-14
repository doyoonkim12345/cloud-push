
;// CONCATENATED MODULE: ./src/server/responses/ErrorResponse.ts
const ErrorResponse = (error)=>{
    return new Response(JSON.stringify({
        error: error.message
    }), {
        status: 404,
        headers: {
            "Content-Type": "application/json",
            "expo-protocol-version": "1"
        }
    });
};

export { ErrorResponse };
