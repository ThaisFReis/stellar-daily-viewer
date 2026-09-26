import { NextResponse } from "next/server";
import { getReports, getPending, getSignature } from "@/lib/reports";

export const dynamic = "force-dynamic";
export const revalidate = 0;

/**
 * ?signature=1 devolve só a assinatura do disco — é o que o cliente
 * consulta em intervalo curto, para não baixar tudo a cada verificação.
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  try {
    if (searchParams.get("signature") === "1") {
      return NextResponse.json({ signature: await getSignature() });
    }
    const [reports, pending] = await Promise.all([getReports(), getPending()]);
    return NextResponse.json({
      reports,
      pending,
      signature: reports.map((r) => `${r.date}:${Math.round(r.mtimeMs)}`).join("|"),
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Falha ao ler os relatórios" },
      { status: 500 },
    );
  }
}
