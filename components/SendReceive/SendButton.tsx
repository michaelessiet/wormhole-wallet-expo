import { ArrowUpRight } from "@tamagui/lucide-icons";
import { Button, Sheet } from "tamagui";
import { useState } from "react";
import SendForm from "./SendForm";
import { ToastProvider } from "@tamagui/toast";
import { CurrentToast } from "components/CurrentToast";

export default function SendButton() {
  const [sheetState, setSheetState] = useState(false);

  return (
    <>
      <Button icon={<ArrowUpRight />} onPress={() => setSheetState(true)}>
        Send
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
            <SendForm />
          </ToastProvider>
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
