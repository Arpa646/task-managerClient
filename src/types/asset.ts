export interface Asset {
  name: string;
  symbol: string;
  coinName: string;
  balance: number;
  value: string | null;
  price: number | null;
  change24h: number;
  portfolio: number | null;
  marketCap: string | null;
  chartData?: number[];
  chartColor?: string;
  tag?: string;
}
