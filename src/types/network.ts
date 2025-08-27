export interface Network {
  id: string;
  name: string;
  icon: string;
  chainId: number;
}

export const SUPPORTED_NETWORKS: Network[] = [
  { id: "ethereum", name: "Ethereum", icon: "🔷", chainId: 1 },
  { id: "polygon", name: "Polygon", icon: "💜", chainId: 137 },
  { id: "arbitrum", name: "Arbitrum", icon: "🔵", chainId: 42161 },
  { id: "optimism", name: "Optimism", icon: "🔴", chainId: 10 },
];
