"use server";

import { generateBrowserClient } from "@cloud-push/core/utils";
import { dbNodeClient, storageNodeClient } from "./nodeClient";

export const storageBrowserClient = generateBrowserClient(storageNodeClient);

export const dbBrowserClient = generateBrowserClient(dbNodeClient);
