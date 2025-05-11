import { ArrowUpRight } from "@tamagui/lucide-icons";
import { Button, Sheet } from "tamagui";
import { useState } from "react";
import SendForm from "./SendForm";

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
      >
        <Sheet.Overlay bg={"$accent10"} opacity={0.2} />
        <Sheet.Handle />

        <Sheet.Frame>
          <SendForm />
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
