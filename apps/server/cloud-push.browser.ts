"use server";

import { generateBrowserClient } from "@cloud-push/next";
import { storageNodeClient, dbNodeClient } from "@/cloud-push.server";

export const storageBrowserClient = generateBrowserClient(storageNodeClient);
export const dbBrowserClient = generateBrowserClient(dbNodeClient);
