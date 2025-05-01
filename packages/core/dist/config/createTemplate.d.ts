import type { Db, Storage } from "../types";
export type TemplateFrom = "next" | "react-native";
export declare const createConfigTemplate: ({ db, storage, where, }: {
    db: Db;
    storage: Storage;
    where: TemplateFrom;
}) => string;
//# sourceMappingURL=createTemplate.d.ts.map