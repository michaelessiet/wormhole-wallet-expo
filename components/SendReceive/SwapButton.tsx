import { Repeat } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Button, Sheet } from "tamagui";
import { SwapForm } from "./SwapForm";
import { ToastProvider } from "@tamagui/toast";
import { CurrentToast } from "components/CurrentToast";

export function SwapButton() {
  const [sheetState, setSheetState] = useState(false);

  return (
    <>
      <Button onPress={() => setSheetState(true)}>
        <Repeat size={"$1"} />
      </Button>

      <Sheet
        open={sheetState}
        snapPointsMode="fit"
        onOpenChange={setSheetState}
        modal
        moveOnKeyboardChange
        dismissOnSnapToBottom
      >
        <Sheet.Overlay bg={"$accent10"} opacity={0.2} />
        <Sheet.Handle />

        <Sheet.Frame>
          <ToastProvider>
            <CurrentToast />
            <SwapForm />
          </ToastProvider>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
