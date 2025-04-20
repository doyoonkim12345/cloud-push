import { Low } from "lowdb";
export declare const LowDbLoader: {
    loadLowDb: <T>(value?: T) => Promise<Low<T>>;
    loadLowDbFromFile: <T>(file: Buffer, defaultValue?: T) => Promise<Low<T>>;
    loadLowDbFromPath: <T>(filePath: string, defaultValue?: T) => Promise<Low<T>>;
};
//# sourceMappingURL=LowDbLoader.d.ts.map