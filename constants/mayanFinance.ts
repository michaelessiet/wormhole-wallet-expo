import type { ChainName } from "@mayanfinance/swap-sdk";
import axios from "axios";

export const blockchainsToMayanFinanceChainIds: Record<number, ChainName> = {
  1: "solana",
  2: "ethereum",
  30: "base",
  23: "arbitrum",
  6: "avalanche",
  4: "bsc",
  24: "optimism",
  5: "polygon",
};

export const blockchains: ChainName[] = [
  "unichain",
  "aptos",
  "arbitrum",
  "avalanche",
  "base",
  "bsc",
  "ethereum",
  "linea",
  "optimism",
  "polygon",
  "solana",
  "sui",
];

export const mayanFinanceAPIClient = axios.create({
  baseURL: "https://explorer-api.mayan.finance/v3",
});

export const NATIVE_TOKEN_ADDRESS =
  "0x0000000000000000000000000000000000000000";
