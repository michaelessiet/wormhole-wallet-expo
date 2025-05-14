import { History, Settings } from "@tamagui/lucide-icons";
import SendReceive from "components/SendReceive";
import TokenList from "components/TokenList";
import { useRouter } from "expo-router";
import { RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import useBalanceStore from "store/useBalanceStore";
import { Button, ScrollView, Text, useTheme, XStack, YStack } from "tamagui";

export default function Overview() {
  const { totalUSDBalance, isLoadingBalance, fetchBalance, isFetchingBalance } =
    useBalanceStore();
  const router = useRouter();
  const theme = useTheme();

  return (
    <SafeAreaView style={{ height: "100%" }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={isFetchingBalance}
            onRefresh={fetchBalance}
            tintColor={theme.color.get()}
            title="Pull to refresh"
          />
        }
      >
        <YStack p={"$2"}>
          <XStack self={"flex-end"} gap={"$4"}>
            <Button asChild>
              <History onPress={() => router.push("/history")} />
            </Button>

            <Button asChild>
              <Settings onPress={() => router.push("/modal")} />
            </Button>
          </XStack>

          <YStack height={"$20"} justify={"center"}>
            <Text text="center">Current Balance</Text>
            <Text fontSize={"$10"} fontWeight={"bold"} text="center">
              {isLoadingBalance ? "Loading..." : `$${totalUSDBalance}`}
            </Text>
          </YStack>
        </YStack>

        <SendReceive />

        <YStack p={"$4"}>
          <TokenList />
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}
