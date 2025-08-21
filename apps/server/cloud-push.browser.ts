"use server";

import { generateBrowserClient } from "@cloud-push/next";
import { storageNodeClient, } from "@/cloud-push.server";

export const storageBrowserClient = generateBrowserClient(storageNodeClient);
