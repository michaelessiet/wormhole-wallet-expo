import { XStack } from "tamagui";
import { ReceiveButton } from "./ReceiveButton";
import { SwapButton } from "./SwapButton";
import SendButton from "./SendButton";

export default function SendReceive() {
  return (
    <XStack justify={"center"} items={"center"} gap={"$2"}>
      <ReceiveButton />
      <SwapButton />
      <SendButton />
    </XStack>
  );
}
