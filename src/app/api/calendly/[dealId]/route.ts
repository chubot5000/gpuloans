export const dynamic = "force-dynamic";

import { supabase } from "data/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ dealId: string }> }) {
  try {
    const { dealId } = await params;

    const { data, error } = await supabase.from("CalendlyMetadata").select("*").eq("deal_id", dealId).single();

    if (error && error.code !== "PGRST116") {
      // PGRST116 = no rows found, which is expected for new deals
      console.error("Failed to get deal", { error, dealId });
      return NextResponse.json({ error: "Failed to get deal" }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching deal:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to fetch deal" },
      { status: 500 },
    );
  }
}
