import type { TransactionsResponse } from "types/yuna";
import { yunaClient } from "constants/yuna";
import useWallet from "hooks/useWallet";
import { useToastController } from "@tamagui/toast";
import usePersistState from "hooks/usePersistState";

export default function useTransactionsStore() {
  const { publicKey } = useWallet();
  const toast = useToastController();
  const [transactions, setTransactions] =
    usePersistState<TransactionsResponse | null>("transactions", null);

  async function fetchTransactions() {
    if (!publicKey) {
      return;
    }

    try {
      const response = await yunaClient.get<TransactionsResponse>(
        "/transactions",
        {
          params: {
            address: publicKey,
            blockchain: "solana",
          },
        },
      );

      setTransactions(response.data);
    } catch (e) {
      toast.show("Error fetching your transactions", {
        message: e.message,
        burntOptions: { haptic: "error", preset: "error" },
      });
    }
  }

  return {
    transactions,
    fetchTransactions,
  };
}
