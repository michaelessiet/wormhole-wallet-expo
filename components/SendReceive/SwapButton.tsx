import { Repeat } from "@tamagui/lucide-icons";
import { useState } from "react";
import { Button, Sheet } from "tamagui";
import { SwapForm } from "./SwapFrom";

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
      >
        <Sheet.Overlay bg={"$accent10"} opacity={0.2} />
        <Sheet.Handle />

        <Sheet.Frame>
          <SwapForm />
        </Sheet.Frame>
      </Sheet>
    </>
  );
}
