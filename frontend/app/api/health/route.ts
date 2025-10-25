import { NextResponse } from "next/server";

export async function GET() {
  const api = process.env.NEXT_PUBLIC_API_BASE!;
  const r = await fetch(`${api}/actuator/health`, { cache: "no-store" });
  const json = await r.json().catch(() => ({}));
  return NextResponse.json({ ok: r.ok, backend: json, api });
}
