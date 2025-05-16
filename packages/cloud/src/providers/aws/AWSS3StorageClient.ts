import {
	GetObjectCommand,
	PutObjectCommand,
	S3Client,
} from "@aws-sdk/client-s3";
import type { Readable } from "node:stream";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import * as path from "node:path";
import * as fs from "node:fs";
import { Upload } from "@aws-sdk/lib-storage";
import { StorageClient } from "@/core/StorageClient";
import type { FileInfo } from "@/types";

interface AWSS3ClientProps {
	region: string;
	accessKeyId: string;
	secretAccessKey: string;
	bucketName: string;
}

export class AWSS3StorageClient extends StorageClient {
	private client: S3Client;
	private bucketName: string;

	constructor({
		region,
		accessKeyId,
		secretAccessKey,
		bucketName,
	}: AWSS3ClientProps) {
		super();
		this.client = new S3Client({
			region,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		});
		this.bucketName = bucketName;
	}

	getFile = async ({ key }: { key: string }): Promise<Uint8Array> => {
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		const response = await this.client.send(command);

		if (!response.Body) {
			throw new Error("File content is empty");
		}

		const stream = response.Body as Readable;
		const chunks: Uint8Array[] = [];

		for await (const chunk of stream) {
			if (typeof chunk === "string") {
				chunks.push(new TextEncoder().encode(chunk));
			} else if (chunk instanceof Uint8Array) {
				chunks.push(chunk);
			} else {
				throw new Error("Unsupported chunk type in stream");
			}
		}

		// 전체 길이 계산
		const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
		const result = new Uint8Array(totalLength);

		// 각 chunk를 이어 붙이기
		let offset = 0;
		for (const chunk of chunks) {
			result.set(chunk, offset);
			offset += chunk.length;
		}

		return result;
	};

	getFileSignedUrl = async ({
		key,
		expiresIn,
	}: {
		key: string;
		expiresIn?: number;
	}) => {
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		const url = await getSignedUrl(this.client, command, { expiresIn });

		return url;
	};

	uploadFile = async ({
		key,
		file,
		contentType = "application/json",
	}: {
		key: string;
		file: Uint8Array;
		contentType?: string;
	}) => {
		// S3 업로드 파라미터 구성
		const params = {
			Bucket: this.bucketName,
			Key: key,
			Body: file,
			ContentType: contentType,
		};

		// 업로드 명령 실행
		const command = new PutObjectCommand(params);
		await this.client.send(command);
	};

	uploadLocalFile = async ({
		fileName,
		filePath,
	}: {
		fileName: string;
		filePath: string;
	}) => {
		// 파일 스트림 생성
		const fileStream = fs.createReadStream(filePath);

		// 업로드 객체 생성
		const upload = new Upload({
			client: this.client,
			params: {
				Bucket: this.bucketName,
				Key: fileName,
				Body: fileStream,
			},
		});

		// 업로드 실행
		const result = await upload.done();

		return result.Location;
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

		// Get list of all files in the directory (recursively collect all files)
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

		for (let i = 0; i < allFiles.length; i++) {
			const { path: filePath, relativePath } = allFiles[i];

			// Upload file
			const s3Key = path.join(cloudPath, relativePath).replace(/\\/g, "/");
			const location = await this.uploadLocalFile({
				filePath,
				fileName: s3Key,
			});

			if (location) {
				uploadedFiles[relativePath] = location;
			}
		}
	};
}
