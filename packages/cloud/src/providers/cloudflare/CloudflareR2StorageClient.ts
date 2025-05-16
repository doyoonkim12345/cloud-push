import { StorageClient } from "@/core/StorageClient";
import type { FileInfo } from "@/types";
import * as fs from "node:fs";
import * as path from "node:path";

// Cloudflare R2 설정 인터페이스
interface CloudflareConfig {
	accountId: string;
	apiToken: string;
	bucket: string;
}

export class CloudflareR2StorageClient extends StorageClient {
	private config: CloudflareConfig;
	private baseUrl: string;

	constructor(config: CloudflareConfig) {
		super();
		this.config = config;
		this.baseUrl = `https://api.cloudflare.com/client/v4/accounts/${config.accountId}/r2/buckets/${config.bucket}/objects`;

		// 추상 메서드/속성 구현
		this.getFile = this.getFile.bind(this);
		this.getFileSignedUrl = this.getFileSignedUrl.bind(this);
		this.uploadFile = this.uploadFile.bind(this);
		this.uploadLocalFile = this.uploadLocalFile.bind(this);
		this.uploadDirectory = this.uploadDirectory.bind(this);
	}

	private async fetchWithAuth(url: string, options: RequestInit = {}) {
		const headers = {
			...options.headers,
			Authorization: `Bearer ${this.config.apiToken}`,
		};

		return fetch(url, { ...options, headers });
	}

	getFile = async ({ key }: { key: string }): Promise<Uint8Array> => {
		try {
			const response = await this.fetchWithAuth(
				`${this.baseUrl}/${encodeURIComponent(key)}`,
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch file: ${response.statusText}`);
			}

			const blob = await response.blob();
			const arrayBuffer = await blob.arrayBuffer();
			return new Uint8Array(arrayBuffer); // ✅ 변경
		} catch (error) {
			console.error("Error fetching file from Cloudflare R2:", error);
			throw error;
		}
	};

	getFileSignedUrl = async ({
		key,
		expiresIn = 3600,
	}: {
		key: string;
		expiresIn?: number;
	}): Promise<string> => {
		try {
			const response = await this.fetchWithAuth(
				`${this.baseUrl}/${encodeURIComponent(key)}/presigned-url`,
				{
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ expirationSeconds: expiresIn }),
				},
			);

			if (!response.ok) {
				throw new Error(
					`Failed to generate signed URL: ${response.statusText}`,
				);
			}

			const data = await response.json();
			return "";
			// return data?.result as any.url;
		} catch (error) {
			console.error("Error generating signed URL:", error);
			throw error;
		}
	};

	uploadFile = async ({
		key,
		file,
	}: {
		key: string;
		file: Uint8Array;
	}): Promise<void> => {
		try {
			const response = await this.fetchWithAuth(
				`${this.baseUrl}/${encodeURIComponent(key)}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": "application/octet-stream",
					},
					body: file,
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to upload file: ${response.statusText}`);
			}
		} catch (error) {
			console.error("Error uploading file to Cloudflare R2:", error);
			throw error;
		}
	};

	// 파일 시스템 접근을 별도 메서드로 분리하여 테스트에서 쉽게 모킹할 수 있게 함
	protected readLocalFile(filePath: string): Uint8Array {
		return new Uint8Array(fs.readFileSync(filePath)); // ✅ 변경
	}

	protected getFileExtension(filePath: string): string {
		return path.extname(filePath).toLowerCase();
	}

	protected isDirectory(dirPath: string): boolean {
		return fs.statSync(dirPath).isDirectory();
	}

	protected readDirectory(dirPath: string): string[] {
		return fs.readdirSync(dirPath);
	}

	uploadLocalFile = async ({
		filePath,
		fileName,
	}: {
		filePath: string;
		fileName: string;
	}): Promise<string | undefined> => {
		try {
			const fileData = this.readLocalFile(filePath); // ✅ Uint8Array

			const extension = this.getFileExtension(filePath);
			let contentType = "application/octet-stream";
			const mimeTypes: Record<string, string> = {
				".jpg": "image/jpeg",
				".jpeg": "image/jpeg",
				".png": "image/png",
				".gif": "image/gif",
				".pdf": "application/pdf",
				".txt": "text/plain",
				".html": "text/html",
				".json": "application/json",
			};

			if (extension in mimeTypes) {
				contentType = mimeTypes[extension];
			}

			const blob = new Blob([fileData], { type: contentType }); // ✅ Uint8Array 사용

			const response = await this.fetchWithAuth(
				`${this.baseUrl}/${encodeURIComponent(fileName)}`,
				{
					method: "PUT",
					headers: {
						"Content-Type": contentType,
					},
					body: blob,
				},
			);

			if (!response.ok) {
				throw new Error(`Failed to upload local file: ${response.statusText}`);
			}

			return fileName;
		} catch (error) {
			console.error("Error uploading local file to Cloudflare R2:", error);
			throw error;
		}
	};

	uploadDirectory = async ({
		cloudPath,
		directoryPath,
	}: {
		cloudPath: string;
		directoryPath: string;
	}): Promise<void> => {
		try {
			if (!this.isDirectory(directoryPath)) {
				throw new Error(`${directoryPath} is not a directory.`);
			}

			// 모든 파일 목록 수집 (재귀적으로)
			const allFiles: FileInfo[] = [];

			const collectFiles = (dir: string, base = "") => {
				const files = this.readDirectory(dir);

				for (const file of files) {
					const filePath = path.join(dir, file);
					const relPath = path.join(base, file);

					if (this.isDirectory(filePath)) {
						collectFiles(filePath, relPath);
					} else {
						allFiles.push({
							path: filePath,
							relativePath: relPath,
						});
					}
				}
			};

			collectFiles(directoryPath);

			// 각 파일 업로드
			const uploadedFiles: { [filename: string]: string } = {};

			for (const { path: filePath, relativePath } of allFiles) {
				// cloudPath와 상대 경로를 조합하여 최종 경로 생성
				const r2Key = path.join(cloudPath, relativePath).replace(/\\/g, "/");

				const result = await this.uploadLocalFile({
					filePath,
					fileName: r2Key,
				});

				if (result) {
					uploadedFiles[relativePath] = result;
				}
			}
		} catch (error) {
			console.error("Error uploading directory to Cloudflare R2:", error);
			throw error;
		}
	};
}
