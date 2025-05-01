import { StorageClient } from "@/core/StorageClient";
import type { FileInfo } from "@/core/types";
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

	getFile = async ({ key }: { key: string }) => {
		try {
			const response = await this.fetchWithAuth(
				`${this.baseUrl}/${encodeURIComponent(key)}`,
			);

			if (!response.ok) {
				throw new Error(`Failed to fetch file: ${response.statusText}`);
			}

			const blob = await response.blob();
			const arrayBuffer = await blob.arrayBuffer();
			const buffer = Buffer.from(arrayBuffer);

			return buffer;
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
		file: Buffer;
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
	protected readLocalFile(filePath: string): Buffer {
		return fs.readFileSync(filePath);
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
			// 별도 메서드를 통해 파일 읽기
			const fileBuffer = this.readLocalFile(filePath);

			// 파일 확장자로부터 MIME 타입 추론
			const extension = this.getFileExtension(filePath);
			let contentType = "application/octet-stream";

			// 간단한 MIME 타입 매핑
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

			// 파일을 Blob으로 변환하여 업로드
			const blob = new Blob([fileBuffer], { type: contentType });

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
