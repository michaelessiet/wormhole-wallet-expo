import {
  type ChainName,
  createSwapFromSolanaInstructions,
  fetchQuote,
  fetchTokenList,
  submitSwiftSolanaSwap,
} from "@mayanfinance/swap-sdk";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import useBalanceStore from "store/useBalanceStore";
import type { numericalString } from "types/general";
import useWallet from "./useWallet";
import { useToastController } from "@tamagui/toast";
import {
  Connection,
  MessageV0,
  PublicKey,
  VersionedTransaction,
  type Transaction,
} from "@solana/web3.js";
import { tryAsync } from "try.rs";
import { NATIVE_MINT } from "@solana/spl-token";
import {
  generateSolTransferTransaction,
  generateSPLTransferTransaction,
} from "utils";
import {
  mayanFinanceAPIClient,
  NATIVE_TOKEN_ADDRESS,
} from "constants/mayanFinance";
import type { SwapsResponse } from "types/mayanFinance";

export default function useMayanFinance() {
  const { balance, fetchBalance } = useBalanceStore();
  const [fromAmount, setFromAmount] = useState<numericalString>("");
  const [fromToken, setFromToken] = useState<string>();
  const [toAmount, setToAmount] = useState<numericalString>("");
  const [toToken, setToToken] = useState<string>();
  const [txFee, setTxFee] = useState<numericalString>("");
  const [toChain, setToChain] = useState<ChainName>("solana");
  const [eta, setEta] = useState<number>();
  const { publicKey, signTransaction, connection, keyPair, sendTransaction } =
    useWallet();
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
      tokenList.sort((a, b) => {
        if (a.symbol < b.symbol) return -1;
        if (a.symbol > b.symbol) return 1;
        return 0;
      });
      return tokenList;
    },
  });

  const { data: quote } = useQuery({
    queryKey: ["mayanFinance", "quote", fromAmount, fromToken, toToken],
    enabled: !Number.isNaN(Number(fromAmount)) && !!fromToken && !!toToken,
    refetchInterval: 5000,
    queryFn: async () => {
      if (!fromAmount || !fromToken || !toToken) return null;

      if (
        balance?.tokens.find(
          (token) => token.address.toLowerCase() === toToken.toLowerCase(),
        )
      ) {
        setTxFee("0");
        setEta(0);
        setToAmount(fromAmount);
        return null;
      }

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

  const {
    data: mayanFinanceSwapHistory,
    refetch: fetchMayanFinanceSwapHistory,
    isFetching: isLoadingMayanFinanceSwapHistory,
  } = useQuery({
    queryKey: ["mayanfinance", "transaction", "history", publicKey],
    enabled: !!publicKey,
    queryFn: async () => {
      const res = await tryAsync(async () =>
        mayanFinanceAPIClient.get<SwapsResponse>("/swaps", {
          params: {
            trader: publicKey,
          },
        }),
      );

      if (res.error) {
        console.error("Error fetching transaction history:", res.error);
        toast.show("Error fetching transaction history", {
          customData: { type: "error" },
        });
        return [];
      }

      return res.value.data.data;
    },
  });

  const fromTokens = useMemo(() => {
    if (!tokenList) return [];

    const filteredTokens = tokenList.filter((v) => {
      const tokensInBalance = balance?.tokens.find(
        (token) => token.address.toLowerCase() === v.mint.toLowerCase(),
      );

      return !!tokensInBalance;
    });

    // @ts-expect-error - don't need all the other keys
    filteredTokens.push({
      chainId: 1,
      mint: NATIVE_TOKEN_ADDRESS,
      contract: NATIVE_TOKEN_ADDRESS,
      logoURI: "https://statics.mayan.finance/SOL.png",
      decimals: 9,
      name: "Solana",
      symbol: "SOL",
    });

    return filteredTokens;
  }, [tokenList, balance]);

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
    if (!publicKey || !keyPair)
      return toast.show("Wallet not initialized properly", {
        customData: { type: "error" },
      });

    toast.show(toAddress ? "Sending..." : "Swapping...", {
      customData: { spinner: true },
    });

    if (
      toToken &&
      balance?.tokens.find(
        (token) => token.address.toLowerCase() === toToken.toLowerCase(),
      ) &&
      toAddress
    ) {
      let tx: Transaction;

      if (toToken.toLowerCase() === NATIVE_MINT.toBase58().toLowerCase()) {
        tx = await generateSolTransferTransaction(
          Number(fromAmount),
          keyPair,
          toAddress,
          connection,
        );
      } else {
        tx = await generateSPLTransferTransaction(
          Number(fromAmount),
          keyPair,
          toAddress,
          toToken,
          connection,
        );
      }

      const signedTx = signTransaction(tx);
      const txSignature = await sendTransaction(signedTx);

      return txSignature;
    }

    const swapTx = await tryAsync(async () => {
      const res = await createSwapFromSolanaInstructions(
        quote,
        publicKey,
        toAddress ?? publicKey,
        null,
        new Connection(process.env.EXPO_PUBLIC_RPC_URL as string),
      );

      const { blockhash } = await connection.getLatestBlockhash();
      const message = MessageV0.compile({
        instructions: res.instructions,
        payerKey: new PublicKey(publicKey),
        recentBlockhash: blockhash,
        addressLookupTableAccounts: res.lookupTables,
      });
      const tx = new VersionedTransaction(message);

      const signedTx = signTransaction(tx, res.signers);

      if (quote.gasless) {
        const serializedTx = Buffer.from(signedTx.serialize()).toString(
          "base64",
        );
        const { orderHash } = await submitSwiftSolanaSwap(serializedTx);

        return orderHash;
      }

      const txSignature = await sendTransaction(signedTx);

      if (!txSignature) throw new Error("Couldn't send transaction");

      return txSignature;
    });

    if (swapTx.error) {
      console.error("Error swapping:", swapTx.error);
      toast.show("Error swapping", {
        customData: { type: "error" },
      });
      return;
    }

    await fetchBalance();

    toast.show(toAddress ? "Sent successfully" : "Swap successful", {
      customData: { type: "success" },
    });

    return swapTx.value;
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
    mayanFinanceSwapHistory,
    fetchMayanFinanceSwapHistory,
    isLoadingMayanFinanceSwapHistory,
  };
}
