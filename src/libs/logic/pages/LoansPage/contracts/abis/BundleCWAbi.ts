import { parseAbiItem } from "viem";

export const BUNDLE_CW_ABI = [
  /* functions */
  parseAbiItem("function mint(address token, uint256[] calldata tokenIds) external returns (uint256)"),
  /* errors */
  parseAbiItem("error InvalidCaller()"),
  parseAbiItem("error InvalidContext()"),
  parseAbiItem("error InvalidSize()"),
] as const;
