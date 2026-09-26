import { getReports, getPending } from "@/lib/reports";
import Viewer from "@/components/Viewer";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Home() {
  const [reports, pending] = await Promise.all([getReports(), getPending()]);
  return (
    <Viewer
      initialReports={reports}
      initialPending={pending}
    />
  );
}
