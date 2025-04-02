import * as fs from "fs";
// import * as prompts from "@clack/prompts";
import * as path from "path";
import { S3Client } from "@aws-sdk/client-s3";
import { uploadLocalFile } from "./uploadLocalFile";

// File information interface definition
interface FileInfo {
  path: string;
  relativePath: string;
}

export interface uploadDirectoryProps {
  directoryPath: string;
  s3Path: string;
  bucketName: string;
}

// Function to upload all files in a directory
export async function uploadDirectory(
  s3Client: S3Client,
  { bucketName, directoryPath, s3Path }: uploadDirectoryProps
): Promise<void> {
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
    const s3Key = path.join(s3Path, relativePath).replace(/\\/g, "/");
    const location = await uploadLocalFile(s3Client, {
      filePath,
      fileName: s3Key,
      bucketName,
    });

    if (location) {
      uploadedFiles[relativePath] = location;
    }
  }
}
