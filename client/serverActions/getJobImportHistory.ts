"use server";

import { GET_IMPORT_JOB_HISTORY_PATH } from "@/constants/endpoints";
import { fetchData } from "@/lib/fetch";

export async function getJobImportHistoryServerAction() {
  try {
    const data = await fetchData(GET_IMPORT_JOB_HISTORY_PATH);
    return data;
  } catch (error) {
    throw error;
  }
}
