import { StorageClient } from "@/core/StorageClient";
import type { FileInfo } from "@/types";
import {
	createClient,
	type SupabaseClient as OriginalSupabaseClient,
} from "@supabase/supabase-js";
import * as fs from "node:fs";
import * as path from "node:path";

interface SupabaseClientProps {
	supabaseUrl: string;
	supabaseKey: string;
	bucketName: string;
}

export class SupabaseStorageClient extends StorageClient {
	client: OriginalSupabaseClient;
	bucketName: string;

	constructor({ supabaseUrl, supabaseKey, bucketName }: SupabaseClientProps) {
		super();
		this.client = createClient(supabaseUrl, supabaseKey);
		this.bucketName = bucketName;
	}

	getFile = async ({
		key,
		mimeType,
	}: { key: string; mimeType?: string }): Promise<Uint8Array> => {

		const { data, error } = await this.client.storage
			.from(this.bucketName)
			.download(`${key}?v=${Date.now()}`);

		if (error) {
			throw new Error(`Error downloading file: ${error.message}`);
		}

		if (!data) {
			throw new Error("File content is empty");
		}

		const arrayBuffer = await data.arrayBuffer();
		return new Uint8Array(arrayBuffer); // ✅ 변경
	};

	getFileUrl = async ({
		key,
		expiresIn = 3600,
	}: {
		key: string;
		expiresIn?: number;
	}) => {
		// Supabase Storage에서 서명된 URL 생성
		const { data, } = await this.client.storage
			.from(this.bucketName)
			.getPublicUrl(key)


		if (!data || !data.publicUrl) {
			throw new Error("Failed to generate signed URL");
		}

		return data.publicUrl;
	};

	// 클래스 내부 메서드로 추가
	moveDirectory = async ({
		fromDir,
		toDir,
		overwrite = false,
	}: {
		fromDir: string;
		toDir: string;
		overwrite?: boolean;
	}) => {
		const norm = (s: string) => s.replace(/^\/+|\/+$/g, ""); // 양끝 슬래시 정리
		const src = norm(fromDir);
		const dst = norm(toDir);

		if (!src) throw new Error("fromDir is required");
		if (!dst) throw new Error("toDir is required");
		if (dst === src || dst.startsWith(src + "/")) {
			throw new Error("Destination cannot be the same as or a child of source");
		}

		// 재귀적으로 파일만 수집
		const listAllFiles = async (path = src): Promise<string[]> => {
			const files: string[] = [];
			let offset = 0;
			const limit = 100; // Supabase 기본 페이지 크기

			while (true) {
				const { data, error } = await this.client.storage
					.from(this.bucketName)
					.list(path === "" ? undefined : path, {
						limit,
						offset,
						sortBy: { column: "name", order: "asc" },
					});

				if (error) {
					throw new Error(`Error listing "${path}": ${error.message}`);
				}
				if (!data || data.length === 0) break;

				for (const item of data) {
					const itemPath = (path ? `${path}/` : "") + item.name;

					// 파일/폴더 구분: 파일은 metadata가 존재(사이즈 등), 폴더는 null
					// (SDK가 반환하는 구조를 이용)
					if ((item as any).metadata) {
						files.push(itemPath);
					} else {
						// 하위 폴더 재귀
						const childFiles = await listAllFiles(itemPath);
						files.push(...childFiles);
					}
				}

				if (data.length < limit) break;
				offset += limit;
			}

			return files;
		};

		const files = await listAllFiles();

		// 이동 (덮어쓰기 옵션 처리)
		for (const srcPath of files) {
			const suffix = srcPath.slice(src.length).replace(/^\/+/, ""); // src 이후 상대 경로
			const dstPath = dst ? `${dst}/${suffix}` : suffix;

			if (overwrite) {
				// 대상이 이미 있으면 move가 실패하므로 미리 제거
				await this.client.storage.from(this.bucketName).remove([dstPath]);
			}

			const { error } = await this.client.storage
				.from(this.bucketName)
				.move(srcPath, dstPath);

			if (error) {
				throw new Error(`Move failed: "${srcPath}" -> "${dstPath}": ${error.message}`);
			}
		}
	};
	uploadFile = async ({
		key,
		file,
		contentType = "application/json",
	}: {
		key: string;
		file: Uint8Array; // ✅ 변경
		contentType?: string;
	}) => {
		const { error } = await this.client.storage
			.from(this.bucketName)
			.upload(key, file, {
				contentType,
				upsert: true,
			});

		if (error) {
			throw new Error(`Error uploading file: ${error.message}`);
		}
	};

	uploadLocalFile = async ({
		filePath,
		fileName,
	}: {
		filePath: string;
		fileName: string;
	}): Promise<string> => {
		const fileData = new Uint8Array(fs.readFileSync(filePath)); // ✅ 변경
		const contentType = this.getContentType(filePath);

		const { error } = await this.client.storage
			.from(this.bucketName)
			.upload(fileName, fileData, {
				contentType,
				upsert: true,
			});

		if (error) {
			throw new Error(`Error uploading local file: ${error.message}`);
		}

		const { data: publicUrlData } = await this.client.storage
			.from(this.bucketName)
			.getPublicUrl(fileName);

		return publicUrlData.publicUrl;
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

		// 디렉토리 내 모든 파일 수집 (재귀적으로)
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
					allFiles.push({
						path: filePath,
						relativePath: relPath,
					});
				}
			}
		}

		collectFiles(directoryPath);

		// 수집된 모든 파일 업로드
		for (let i = 0; i < allFiles.length; i++) {
			const { path: filePath, relativePath } = allFiles[i];

			// 파일 업로드
			const s3Key = path.join(cloudPath, relativePath).replace(/\\/g, "/");
			const publicUrl = await this.uploadLocalFile({
				filePath,
				fileName: s3Key,
			});

			if (publicUrl) {
				uploadedFiles[relativePath] = publicUrl;
			}
		}
	};

	// 파일 확장자를 기반으로 Content-Type 유추
	private getContentType(filePath: string): string {
		const extension = path.extname(filePath).toLowerCase();
		const contentTypeMap: { [key: string]: string } = {
			".html": "text/html",
			".css": "text/css",
			".js": "application/javascript",
			".json": "application/json",
			".png": "image/png",
			".jpg": "image/jpeg",
			".jpeg": "image/jpeg",
			".gif": "image/gif",
			".svg": "image/svg+xml",
			".pdf": "application/pdf",
			".txt": "text/plain",
			".mp4": "video/mp4",
			".mp3": "audio/mpeg",
			// 필요에 따라 더 많은 타입 추가 가능
		};

		return contentTypeMap[extension] || "application/octet-stream";
	}

	// 파일 삭제 기능 추가
	deleteFile = async (key: string) => {
		const { error } = await this.client.storage
			.from(this.bucketName)
			.remove([key]);

		if (error) {
			throw new Error(`Error deleting file: ${error.message}`);
		}
	};

	// 여러 파일 삭제 기능 추가
	deleteFiles = async (keys: string[]) => {
		const { error } = await this.client.storage
			.from(this.bucketName)
			.remove(keys);

		if (error) {
			throw new Error(`Error deleting files: ${error.message}`);
		}
	};

	// 파일 복사 기능 추가
	copyFile = async (fromKey: string, toKey: string) => {
		const { error } = await this.client.storage
			.from(this.bucketName)
			.copy(fromKey, toKey);

		if (error) {
			throw new Error(`Error copying file: ${error.message}`);
		}
	};

	// 파일 이동 기능 추가 (복사 후 원본 삭제)
	moveFile = async (fromKey: string, toKey: string) => {
		// 파일 복사
		await this.copyFile(fromKey, toKey);

		// 원본 파일 삭제
		await this.deleteFile(fromKey);
	};
}
