import { UpdateStatus } from "@cloud-push/cloud";

export function StatusResponse({
	status,
}: {
	status: UpdateStatus;
}): Response {
	const headers = {
		"cache-control": "private, max-age=0",
		"content-type": "application/json",
	};

	return new Response(JSON.stringify(status), {
		status: 200,
		headers,
	});
}
