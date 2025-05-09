export const ErrorResponse = (error: Error): Response => {
	return new Response(JSON.stringify({ error: error.message }), {
		status: 404,
		headers: {
			"Content-Type": "application/json",
			"expo-protocol-version": "0",
		},
	});
};
