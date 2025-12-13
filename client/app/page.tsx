import JobImportHistory from "@/components/layouts/JobImportHistory";
import { getJobImportHistoryServerAction } from "@/serverActions/getJobImportHistory";

export default async function Home() {
  const data = await getJobImportHistoryServerAction();

  return <JobImportHistory data={data.data} />;
}
