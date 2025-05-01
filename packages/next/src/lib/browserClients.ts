import { generateBrowserClient } from "./generateBrowserClient";
import { dbNodeClient, storageNodeClient } from "./serverClients";

export const storageBrowserClient = generateBrowserClient(storageNodeClient);
export const dbBrowserClient = generateBrowserClient(dbNodeClient);
