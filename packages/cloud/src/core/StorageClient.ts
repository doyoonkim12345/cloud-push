export abstract class StorageClient {
	abstract getFile: (params: { key: string }) => Promise<Uint8Array>;
	abstract getFileSignedUrl: (params: {
		key: string;
		expiresIn?: number;
	}) => Promise<string>;
	abstract uploadFile: (params: {
		key: string;
		file: Uint8Array;
		contentType?: string;
	}) => Promise<void>;
	abstract uploadLocalFile: (params: {
		filePath: string;
		fileName: string;
	}) => Promise<string | undefined>;
	abstract uploadDirectory: (params: {
		cloudPath: string;
		directoryPath: string;
	}) => Promise<void>;
}
