import { Button, Text, YStack } from "tamagui";
import { Route } from "@tamagui/lucide-icons";
import { useToastController } from "@tamagui/toast";
import useWallet from "hooks/useWallet";
import { useRouter } from "expo-router";

export default function Onboarding() {
  const router = useRouter();
  const { generateWallet } = useWallet();

  return (
    <YStack justify={"center"} items={"center"} height={"100%"} gap={"$9"}>
      <Route size={"$15"} />
      <YStack justify={"center"} items={"center"} gap={"$5"}>
        <YStack>
          <Text text={"center"} fontWeight={"bold"} fontSize={"$9"}>
            Blazing Fast
          </Text>
          <Text
            text={"center"}
            opacity={0.8}
            color={"$blue10"}
            fontWeight={"bold"}
            fontSize={"$9"}
          >
            Cross-chain Transfers
          </Text>
        </YStack>

        <Text maxW={"$20"} text={"center"} fontSize={"$5"}>
          Transfer assets across multiple blockchains in seconds through
          intent-based bridging
        </Text>
      </YStack>

      <Button
        theme={"blue"}
        onPress={() => {
          const isWalletGenerated = generateWallet();

          if (isWalletGenerated) {
            router.push("/overview");
          }
        }}
      >
        Create Wallet
      </Button>
    </YStack>
  );
}
