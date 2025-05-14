export interface SwapsResponse {
  data: SwapsDatum[];
  metadata: SwapsMetadata;
}

export interface SwapsDatum {
  trader: string;
  sourceTxHash: string;
  sourceChain: string;
  swapChain: string;
  destChain: string;
  fromAmount: string;
  fromTokenAddress: string;
  fromTokenChain: string;
  fromTokenSymbol: string;
  fromTokenLogoUri: string;
  fromTokenPrice: number;
  toTokenPrice: number;
  toTokenAddress: string;
  toTokenChain: string;
  toTokenSymbol: string;
  toTokenLogoUri: string;
  destAddress: string;
  status: string;
  clientStatus: string;
  initiatedAt: Date;
  toAmount: string;
  stateAddr: string;
  service: string;
  statusUpdatedAt: Date;
  auctionMode: number | null;
  referrerBps: number | null;
  mayanBps: number | null;
  orderHash: null | string;
  cctpNonce: null;
  fulfillTxHash: string;
  refundTxHash: null | string;
  clientRelayerFeeRefund: number;
  orderId: string;
  clientRelayerFeeSuccess?: number;
}

export interface SwapsMetadata {
  count: number;
  volume: number;
}
