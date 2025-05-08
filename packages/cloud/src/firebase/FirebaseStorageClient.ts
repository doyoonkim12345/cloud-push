import { StorageClient } from "@/core/StorageClient";
import type { FileInfo } from "@/core/types";
import { getStorage, type Storage } from "firebase-admin/storage";
import * as path from "node:path";
import * as fs from "node:fs";
import { initialize } from "./initialize";
import type { Agent } from "node:https";

interface FirebaseStorageClientProps {
	credential: string;
	httpAgent?: Agent;
	bucketName?: string;
}

export class FirebaseStorageClient extends StorageClient {
	private bucket: ReturnType<Storage["bucket"]>;

	constructor({
		credential,
		httpAgent,
		bucketName = "bundles",
	}: FirebaseStorageClientProps) {
		super();
		const app = initialize(credential, httpAgent);
		this.bucket = getStorage(app).bucket(bucketName);
	}

	getFile = async ({ key }: { key: string }): Promise<Uint8Array> => {
		const file = this.bucket.file(key);
		const chunks: Uint8Array[] = [];

		const stream = file.createReadStream();

		for await (const chunk of stream) {
			if (typeof chunk === "string") {
				chunks.push(new TextEncoder().encode(chunk));
			} else if (chunk instanceof Uint8Array) {
				chunks.push(chunk);
			} else {
				throw new Error("Unsupported chunk type");
			}
		}

		// 수동으로 Uint8Array 병합
		const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
		const result = new Uint8Array(totalLength);
		let offset = 0;
		for (const chunk of chunks) {
			result.set(chunk, offset);
			offset += chunk.length;
		}

		return result;
	};

	getFileSignedUrl = async ({
		key,
		expiresIn = 3600, // 1시간
	}: {
		key: string;
		expiresIn?: number;
	}) => {
		const file = this.bucket.file(key);
		const [url] = await file.getSignedUrl({
			action: "read",
			expires: Date.now() + expiresIn * 1000,
		});
		return url;
	};

	uploadFile = async ({
		key,
		file,
		contentType = "application/octet-stream",
	}: {
		key: string;
		file: Uint8Array;
		contentType?: string;
	}) => {
		const fileRef = this.bucket.file(key);
		await fileRef.save(file, {
			contentType,
			resumable: false,
		});
	};

	uploadLocalFile = async ({
		fileName,
		filePath,
	}: {
		fileName: string;
		filePath: string;
	}) => {
		const [uploaded] = await this.bucket.upload(filePath, {
			destination: fileName,
		});
		return `gs://${uploaded.bucket.name}/${uploaded.name}`;
	};

	uploadDirectory = async ({
		cloudPath,
		directoryPath,
	}: {
		cloudPath: string;
		directoryPath: string;
	}) => {
		const uploadedFiles: { [filename: string]: string } = {};

		const stats = fs.statSync(directoryPath);
		if (!stats.isDirectory()) {
			throw new Error(`${directoryPath} is not a directory.`);
		}

		const allFiles: FileInfo[] = [];

		function collectFiles(dir: string, base = "") {
			const files = fs.readdirSync(dir);
			for (const file of files) {
				const filePath = path.join(dir, file);
				const relPath = path.join(base, file);
				const fileStats = fs.statSync(filePath);

				if (fileStats.isDirectory()) {
					collectFiles(filePath, relPath);
				} else {
					allFiles.push({ path: filePath, relativePath: relPath });
				}
			}
		}

		collectFiles(directoryPath);

		for (const { path: filePath, relativePath } of allFiles) {
			const storagePath = path
				.join(cloudPath, relativePath)
				.replace(/\\/g, "/");
			const url = await this.uploadLocalFile({
				filePath,
				fileName: storagePath,
			});
			uploadedFiles[relativePath] = url;
		}
	};
}
