import type { BalanceResponse } from "types/yuna";
import { yunaClient } from "constants/yuna";
import useWallet from "hooks/useWallet";
import { useToastController } from "@tamagui/toast";
import usePersistState from "hooks/usePersistState";
import { useMemo } from "react";

export default function useBalanceStore() {
  const { publicKey } = useWallet();
  const toast = useToastController();
  const [balance, setBalance] = usePersistState<BalanceResponse | null>(
    "balance",
    null,
  );

  const totalUSDBalance = useMemo(() => {
    let usd = balance?.balance.usd ?? 0;

    for (const token of balance?.tokens ?? []) {
      usd += token.usd;
    }

    return usd;
  }, [balance]);

  async function fetchBalance() {
    if (!publicKey) {
      return;
    }

    try {
      const response = await yunaClient.get<BalanceResponse>("/balance", {
        params: {
          address: publicKey,
          blockchain: "solana",
        },
      });

      setBalance(response.data);
    } catch (e) {
      toast.show("Error fetching your balance", {
        message: e.message,
        burntOptions: { haptic: "error", preset: "error" },
      });
    }
  }

  return {
    balance,
    fetchBalance,
    totalUSDBalance,
  };
}
