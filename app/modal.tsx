import { useRouter } from "expo-router";
import useWallet from "hooks/useWallet";
import { useState } from "react";
import { Button, Paragraph, View } from "tamagui";

export default function ModalScreen() {
  const { privateKey, setPrivateKey, clearWallet } = useWallet();
  const [isPrivateKeyShown, setIsPrivateKeyShown] = useState(false);
  const router = useRouter();

  return (
    <View flex={1} items="center" justify="center" gap={"$4"}>
      {isPrivateKeyShown ? (
        <View>
          <Paragraph text={"center"}>This is your private key:</Paragraph>
          <Paragraph selectable text={"center"}>
            {privateKey}
          </Paragraph>
        </View>
      ) : null}

      <Button onPress={() => setIsPrivateKeyShown((v) => !v)}>
        {isPrivateKeyShown ? "Hide Private Key" : "Show Private Key"}
      </Button>

      <Button
        theme={"red"}
        onPress={() => {
          clearWallet();
          router.dismissTo("/(onboarding)");
        }}
      >
        Erase Wallet
      </Button>
    </View>
  );
}
