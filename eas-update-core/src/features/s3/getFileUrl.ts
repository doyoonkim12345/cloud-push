export function getFileUrl({
  bucketName,
  region,
  key,
}: {
  bucketName: string;
  region: string;
  key: string;
}): string {
  // 기본 퍼블릭 URL 생성
  const url = `https://${bucketName}.s3.${region}.amazonaws.com/${key.replace(
    /\\/g,
    "/"
  )}`;

  console.log(url);

  return url;
}
