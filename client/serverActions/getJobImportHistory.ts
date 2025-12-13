"use server";

import { GET_IMPORT_JOB_HISTORY_PATH } from "@/constants/endpoints";
import { fetchData } from "@/lib/fetch";

export async function getJobImportHistoryServerAction(filter?: any) {
  try {
    const params = new URLSearchParams(filter);
    const data = await fetchData(`${GET_IMPORT_JOB_HISTORY_PATH}?${params}`);
    return data;
  } catch (error) {
    throw error;
  }
}
