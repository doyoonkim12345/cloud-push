import { loadConfig } from "./loadConfig";

const { db, storage } = { db: {}, storage: {} }; // loadConfig();

export const storageNodeClient = storage;
export const dbNodeClient = db;
