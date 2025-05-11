import { Settings } from "@tamagui/lucide-icons";
import SendReceive from "components/SendReceive";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useBalanceStore from "store/useBalanceStore";
import { Button, ScrollView, Text, YStack } from "tamagui";

export default function Overview() {
  const { totalUSDBalance, isFetchingBalance } = useBalanceStore();
  const router = useRouter();

  return (
    <ScrollView>
      <SafeAreaView>
        <YStack>
          <Button asChild>
            <Settings self={"flex-end"} onPress={() => router.push("/modal")} />
          </Button>

          <YStack height={"$20"} justify={"center"}>
            <Text text="center">Current Balance</Text>
            <Text fontSize={"$10"} fontWeight={"bold"} text="center">
              {isFetchingBalance ? "Loading..." : `$${totalUSDBalance}`}
            </Text>
          </YStack>
        </YStack>

        <SendReceive />
      </SafeAreaView>
    </ScrollView>
  );
}
