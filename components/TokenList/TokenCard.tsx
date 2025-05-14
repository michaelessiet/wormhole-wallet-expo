import { Text, XStack, YStack } from "tamagui";
import type { Token } from "types/yuna";
import FastImage from "@d11/react-native-fast-image";

export default function TokenCard(props: Token) {
  return (
    <XStack items={"center"} justify={"space-between"}>
      <XStack gap={"$2"} py={"$4"}>
        <FastImage
          source={{ uri: props.icon }}
          style={{ borderRadius: 300, width: 40, height: 40 }}
        />

        <YStack>
          <Text>{props.symbol}</Text>
          <Text opacity={0.7}>{props.balance}</Text>
        </YStack>
      </XStack>

      <Text>$ {props.usd}</Text>
    </XStack>
  );
}
