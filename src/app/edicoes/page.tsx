import { getReports } from "@/lib/reports";
import Viewer from "@/components/Viewer";
export const dynamic = "force-dynamic";
export default async function Editions({searchParams}: {searchParams: Promise<{date?: string; caderno?: string}>}) {
 const [reports, params] = await Promise.all([getReports(), searchParams]);
 return <Viewer initialReports={reports} initialPending={null} initialDate={params.date} initialCaderno={params.caderno === "web3" ? "web3" : "stellar"}/>;
}
