import { ArrowDownLeft, Copy } from "@tamagui/lucide-icons";
import useWallet from "hooks/useWallet";
import { useState } from "react";
import { Button, Sheet, YStack } from "tamagui";
import QRCodeStyled from "react-native-qrcode-styled";
import * as Clipboard from "expo-clipboard";
import { useToastController } from "@tamagui/toast";

export function ReceiveButton() {
  const [sheetState, setSheetState] = useState(false);
  const toast = useToastController();
  const wallet = useWallet();

  return (
    <>
      <Button icon={<ArrowDownLeft />} onPress={() => setSheetState(true)}>
        Receive
      </Button>

      <Sheet
        open={sheetState}
        snapPoints={[50]}
        onOpenChange={setSheetState}
        modal
      >
        <Sheet.Overlay bg={"$accent10"} opacity={0.2} />
        <Sheet.Handle />

        <Sheet.Frame>
          <YStack justify={"center"} items={"center"} height={"100%"}>
            <QRCodeStyled
              data={wallet.publicKey}
              color="white"
              padding={20}
              pieceSize={6}
              pieceCornerType={"rounded"}
              pieceBorderRadius={4}
            />
            <Button
              iconAfter={Copy}
              maxW={"80%"}
              onPress={async () => {
                toast.show("Wallet address copied!");
                await Clipboard.setStringAsync(wallet.publicKey ?? "");
              }}
            >
              {wallet.publicKey}
            </Button>
          </YStack>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
