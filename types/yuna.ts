export interface BalanceResponse {
  balance: {
    ether: number;
    usd: number;
  };
  tokens: Token[];
}

export interface Token {
  address: string;
  currency: string;
  symbol: string;
  balance: number;
  usd: number;
  icon: string;
  decimals: number;
  blockchain: string;
}

export interface TransactionsResponse {
  blockchain: string;
  blockExplorerUrl: string;
  fromAddress: string;
  toAddress: string;
  txHash: string;
  unit: string;
  value: string;
  blocktime: Date;
  summary: string;
}
