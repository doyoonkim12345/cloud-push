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
import type { FileInfo } from "@/core/types";

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

	getFile = async ({ key }: { key: string }): Promise<Buffer> => {
		// GetObject command creation
		const command = new GetObjectCommand({
			Bucket: this.bucketName,
			Key: key,
		});

		// Fetch the object from S3
		const response = await this.client.send(command);

		// Verify response body
		if (!response.Body) {
			throw new Error("File content is empty");
		}

		// Convert Node.js Readable stream to a Buffer
		const stream = response.Body as Readable;
		const chunks: Buffer[] = [];

		for await (const chunk of stream) {
			chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
		}

		const buffer = Buffer.concat(chunks);

		return buffer;
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
		file: Buffer;
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
