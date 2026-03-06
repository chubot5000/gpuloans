import { GraphQLClient } from "graphql-request";
import { arbitrum, sepolia } from "viem/chains";

const SLUGS: Record<number, string> = {
  [sepolia.id]: "loan_router_sepolia",
  [arbitrum.id]: "loan_router_arbitrum",
};

export function getLoanRouterSubgraphClient(chainId: number) {
  const url = `https://api.goldsky.com/api/public/${process.env.GOLDSKY_PROJECT_ID}/subgraphs/${SLUGS[chainId]}/latest/gn`;
  return new GraphQLClient(url, { headers: { contentType: "application/json" } });
}
