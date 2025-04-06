"use server";

import s3Client from "@cloud-push/core/s3";

const client = s3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const {
  getFile,
  listFoldersWithPagination,
  uploadDirectory,
  uploadFile,
  getFileSignedUrl,
  uploadLocalFile,
} = client;
