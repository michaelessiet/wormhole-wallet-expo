import useMayanFinance from "hooks/useMayanFinance";
import { RefreshControl } from "react-native";
import { ScrollView, Separator, Text, XStack, YStack } from "tamagui";
import { LegendList } from "@legendapp/list";
import { ArrowRightCircle } from "@tamagui/lucide-icons";
import { blockchainsToMayanFinanceChainIds } from "constants/mayanFinance";
import useWallet from "hooks/useWallet";
import { truncateAddress } from "utils";
import { Link } from "expo-router";

export default function History() {
  const {
    mayanFinanceSwapHistory,
    isLoadingMayanFinanceSwapHistory,
    fetchMayanFinanceSwapHistory,
  } = useMayanFinance();
  const { publicKey } = useWallet();

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={isLoadingMayanFinanceSwapHistory}
          onRefresh={fetchMayanFinanceSwapHistory}
        />
      }
    >
      {mayanFinanceSwapHistory?.length === 0 ? (
        <Text>No Transaction History Yet</Text>
      ) : (
        <YStack>
          <LegendList
            data={mayanFinanceSwapHistory ?? []}
            ItemSeparatorComponent={() => <Separator />}
            keyExtractor={(item) => item.orderId}
            renderItem={({ item }) => (
              <Link
                href={`https://explorer.mayan.finance/tx/${item.orderId}`}
                asChild
              >
                <XStack
                  p="$4"
                  borderWidth={1}
                  justify={"space-between"}
                  items={"center"}
                >
                  <YStack>
                    <Text>
                      {
                        blockchainsToMayanFinanceChainIds[
                          Number.parseInt(item.sourceChain)
                        ]
                      }
                    </Text>
                    <Text>From: {truncateAddress(publicKey ?? "")}</Text>
                    <Text>
                      Amount: {item.fromAmount} {item.fromTokenSymbol}
                    </Text>
                  </YStack>
                  <ArrowRightCircle />
                  <YStack>
                    <Text>
                      {
                        blockchainsToMayanFinanceChainIds[
                          Number.parseInt(item.destChain)
                        ]
                      }
                    </Text>
                    <Text>To: {truncateAddress(item.destAddress)}</Text>
                    <Text>
                      Amount: {item.toAmount} {item.toTokenSymbol}
                    </Text>
                  </YStack>
                </XStack>
              </Link>
            )}
          />
        </YStack>
      )}
    </ScrollView>
  );
}
