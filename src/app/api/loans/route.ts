import { getBorrowerLoans } from "pages/LoansPage/data/getBorrowerLoans";
import { isAddress, stringify } from "viem";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const address = searchParams.get("address");

  if (!address || !isAddress(address)) {
    return Response.json({ error: "Invalid or missing address" }, { status: 400 });
  }

  try {
    const loans = await getBorrowerLoans(address);
    return new Response(stringify(loans), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Failed to fetch borrower loans:", error);
    return Response.json({ error: "Failed to fetch loans" }, { status: 500 });
  }
}
