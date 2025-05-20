import React, { useState } from "react";

export default function PemToEnv() {
	const [input, setInput] = useState("");
	const [envString, setEnvString] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const raw = e.target.value;

		const escaped = raw
			.split("\n")
			.map((line) => line.trim())
			.filter((line) => line.length > 0)
			.join("\\n");

		const fullEnv = escaped;

		setInput(raw);
		setEnvString(fullEnv);
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(envString);
			alert("Copied to clipboard!");
		} catch (err) {
			alert("Failed to copy.");
		}
	};

	return (
		<div className="not-prose space-y-4">
			<p className="my-4 leading-7 font-bold">
				The private key from the PEM file
			</p>
			<textarea
				className="w-full p-2 border rounded shadow-sm font-mono text-sm"
				rows={10}
				placeholder="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBg...\n-----END PRIVATE KEY-----"
				value={input}
				onChange={handleChange}
			/>
			<p className="my-4 leading-7 font-bold flex gap-4">
				<span>Converted to a string from a PEM file</span>
				<button
					type="button"
					onClick={handleCopy}
					className="text-sm bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700"
				>
					Copy
				</button>
			</p>
			<div className="relative">
				<textarea
					className="w-full p-2 border rounded shadow-sm font-mono text-sm bg-gray-100"
					rows={4}
					readOnly
					value={envString}
					onFocus={(e) => e.target.select()}
				/>
			</div>
		</div>
	);
}
