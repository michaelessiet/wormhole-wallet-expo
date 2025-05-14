import type { BalanceResponse } from "types/yuna";
import { yunaClient } from "constants/yuna";
import useWallet from "hooks/useWallet";
import { useToastController } from "@tamagui/toast";
import usePersistState from "hooks/usePersistState";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Decimal from "decimal.js";

export default function useBalanceStore() {
  const { publicKey } = useWallet();
  const toast = useToastController();
  const [balance, setBalance] = usePersistState<BalanceResponse | null>(
    "balance",
    null,
  );
  const {
    isFetching: isFetchingBalance,
    refetch: refetchBalance,
    isPending: isLoadingBalance,
  } = useQuery({
    queryKey: ["balance", publicKey],
    queryFn: fetchBalance,
    enabled: !!publicKey,
    refetchInterval: 60000,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
    refetchOnMount: false,
  });

  const totalUSDBalance = useMemo(() => {
    let usd = new Decimal(balance?.balance.usd ?? 0);

    for (const token of balance?.tokens ?? []) {
      usd = usd.plus(token.usd);
    }

    return usd.toNumber();
  }, [balance]);

  async function fetchBalance() {
    if (!publicKey) {
      return false;
    }

    try {
      const response = await yunaClient.get<BalanceResponse>("/balance", {
        params: {
          address: publicKey,
          blockchain: "solana",
        },
      });

      setBalance(response.data);

      return true;
    } catch (e) {
      toast.show("Error fetching your balance", {
        message: e.message,
        customData: { type: "error" },
      });
      return false;
    }
  }

  return {
    balance,
    fetchBalance: refetchBalance,
    isLoadingBalance,
    isFetchingBalance,
    totalUSDBalance,
  };
}
