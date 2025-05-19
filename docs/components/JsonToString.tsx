import React, { useState } from "react";

export default function JsObjectToEnv() {
	const [input, setInput] = useState("");
	const [envString, setEnvString] = useState("");

	const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const raw = e.target.value;
		setInput(raw);

		try {
			// 사용자의 JS 객체 문법을 안전하게 평가
			// biome-ignore lint/security/noGlobalEval: <explanation>
			const obj = eval(`(${raw})`); // 괄호를 감싸야 표현식으로 인식됨
			const json = JSON.stringify(obj);
			setEnvString(json);
		} catch (err) {
			setEnvString("❌ 유효하지 않은 JavaScript 객체입니다.");
		}
	};

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(envString);
			alert("Copied to clipboard!");
		} catch {
			alert("Failed to copy.");
		}
	};

	return (
		<div className="space-y-4">
			<p className="font-bold">Paste a JS-style object:</p>
			<textarea
				className="w-full p-2 border rounded shadow-sm font-mono text-sm"
				rows={10}
				placeholder={`{ foo: "bar", baz: 123 }`}
				value={input}
				onChange={handleChange}
			/>
			<p className="font-bold">Result for .env:</p>
			<pre className="bg-gray-100 p-2 rounded font-mono text-sm break-all">
				{envString}
			</pre>
			<button
				type="button"
				onClick={handleCopy}
				className="bg-blue-500 text-white px-4 py-2 rounded"
			>
				Copy
			</button>
		</div>
	);
}
