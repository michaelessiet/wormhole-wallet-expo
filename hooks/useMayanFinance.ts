import {
  type ChainName,
  fetchQuote,
  fetchTokenList,
  swapFromSolana,
} from "@mayanfinance/swap-sdk";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import useBalanceStore from "store/useBalanceStore";
import type { numericalString } from "types/general";
import useWallet from "./useWallet";
import { useToastController } from "@tamagui/toast";
import { Connection } from "@solana/web3.js";

export default function useMayanFinance() {
  const { balance, fetchBalance } = useBalanceStore();
  const [fromAmount, setFromAmount] = useState<numericalString>("");
  const [fromToken, setFromToken] = useState<string>();
  const [toAmount, setToAmount] = useState<numericalString>("");
  const [toToken, setToToken] = useState<string>();
  const [txFee, setTxFee] = useState<numericalString>("");
  const [toChain, setToChain] = useState<ChainName>("solana");
  const [eta, setEta] = useState<number>();
  const { publicKey, signTransaction } = useWallet();
  const toast = useToastController();

  const { data: tokenList } = useQuery({
    queryKey: ["mayanFinance", "tokenList"],
    queryFn: async () => {
      const tokenList = await fetchTokenList("solana");
      return tokenList;
    },
  });

  const { data: toTokenList } = useQuery({
    queryKey: ["mayanFinance", "toTokenList", toChain],
    enabled: !!toChain,
    queryFn: async () => {
      const tokenList = await fetchTokenList(toChain);
      return tokenList;
    },
  });

  const { data: quote } = useQuery({
    queryKey: ["mayanFinance", "quote", fromAmount, fromToken, toToken],
    enabled: !Number.isNaN(Number(fromAmount)) && !!fromToken && !!toToken,
    refetchInterval: 5000,
    queryFn: async () => {
      if (!fromAmount || !fromToken || !toToken) return null;

      const quote = (
        await fetchQuote({
          fromChain: "solana",
          toChain: toChain,
          fromToken,
          toToken,
          slippageBps: "auto",
          amount: Number(fromAmount),
        })
      )[0];

      setTxFee(`${quote.bridgeFee}`);
      setEta(quote.etaSeconds);
      setToAmount(`${quote.minAmountOut}`);
      return quote;
    },
  });

  const fromTokens = useMemo(() => {
    if (!tokenList) return [];

    return tokenList.filter((v) => {
      const tokensInBalance = balance?.tokens.find(
        (token) => token.address.toLowerCase() === v.mint.toLowerCase(),
      );

      if (v.symbol === "SOL") return true;

      return !!tokensInBalance;
    });
  }, [tokenList]);

  const toTokens = useMemo(() => {
    if (!toTokenList) return [];
    return toTokenList;
  }, [toTokenList]);

  const swap = async (toAddress?: string) => {
    if (!fromAmount || !toAmount)
      return toast.show("No amount found", {
        customData: { type: "error" },
      });
    if (!quote)
      return toast.show("No quote found", {
        customData: { type: "error" },
      });
    if (!publicKey)
      return toast.show("Wallet not initialized properly", {
        customData: { type: "error" },
      });

    toast.show("Swapping...", {
      customData: { spinner: true },
    });

    try {
      const swapTx = await swapFromSolana(
        quote,
        publicKey,
        toAddress ?? publicKey,
        null,
        // @ts-expect-error - dumb type mismatch
        signTransaction,
        new Connection(process.env.EXPO_PUBLIC_RPC_URL as string),
      );

      await fetchBalance();

      return swapTx.signature;
    } catch (e) {
      console.error("Error swapping:", e);
      toast.show("Error swapping", {
        customData: { type: "error" },
      });
    }
  };

  return {
    fromAmount,
    setFromAmount,
    fromToken,
    setFromToken,
    toAmount,
    setToAmount,
    toToken,
    setToToken,
    txFee,
    setTxFee,
    toChain,
    setToChain,
    tokenList: tokenList ?? [],
    fromTokens,
    toTokens,
    swap,
    eta,
  };
}
