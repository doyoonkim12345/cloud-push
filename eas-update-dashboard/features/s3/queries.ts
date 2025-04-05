import { getFile } from "../api/client";
import { VersionCursorStore } from "eas-update-core/version-cursor";

const s3Queries = {
  all: { queryKey: ["s3"] },
  versions: () => ({
    queryKey: [...s3Queries.all.queryKey, "versions"],
    queryFn: async () => {
      const file = await getFile({
        bucketName: process.env.AWS_BUCKET_NAME!,
        key: "cursor.json",
      });
      const versionCursorStore = new VersionCursorStore();

      await versionCursorStore.loadFromJSON(file);

      return versionCursorStore.serialize();
    },
  }),
};

export default s3Queries;
