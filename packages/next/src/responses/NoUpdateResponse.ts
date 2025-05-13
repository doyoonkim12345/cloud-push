export function NoUpdateResponse(): Response {
	return new Response(null, {
		status: 204,
		headers: {
			"expo-protocol-version": "1",
		},
	});
}
