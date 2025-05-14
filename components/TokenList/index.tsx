import { LegendList } from "@legendapp/list";
import { NATIVE_MINT } from "@solana/spl-token";
import useBalanceStore from "store/useBalanceStore";
import { Separator, YStack } from "tamagui";
import TokenCard from "./TokenCard";

export default function TokenList() {
  const { balance } = useBalanceStore();

  return (
    <YStack>
      <LegendList
        data={[
          {
            address: NATIVE_MINT.toBase58(),
            balance: balance?.balance.ether ?? 0,
            blockchain: "Solana",
            decimals: 9,
            symbol: "SOL",
            usd: balance?.balance.usd ?? 0,
            currency: "SOL",
            icon: "https://statics.mayan.finance/SOL.png",
          },
          ...(balance?.tokens ?? []),
        ]}
        keyExtractor={({ address }, i) => address + i.toString()}
        renderItem={({ item }) => <TokenCard {...item} />}
        ItemSeparatorComponent={() => <Separator />}
      />
    </YStack>
  );
}
