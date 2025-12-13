import { getJobImportHistoryServerAction } from "@/serverActions/getJobImportHistory";

export default async function Home() {

  const data = await getJobImportHistoryServerAction();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <h1>
        Homepage
      </h1>
    </div>
  );
}
