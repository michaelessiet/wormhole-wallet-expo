import FastImage from "@d11/react-native-fast-image";
import { LegendList } from "@legendapp/list";
import { NATIVE_TOKEN_ADDRESS } from "constants/mayanFinance";
import useMayanFinance from "hooks/useMayanFinance";
import { useMemo } from "react";
import useBalanceStore from "store/useBalanceStore";
import {
  Adapt,
  Button,
  Input,
  Select,
  Sheet,
  Text,
  XStack,
  YStack,
} from "tamagui";

export function SwapForm() {
  const {
    fromAmount,
    setFromAmount,
    fromTokens,
    fromToken,
    setFromToken,
    toAmount,
    toToken,
    setToToken,
    toTokens,
    toChain,
    swap,
    txFee,
    eta,
  } = useMayanFinance();
  const { balance } = useBalanceStore();

  const selectedTokenBalance = useMemo(() => {
    if (fromToken === NATIVE_TOKEN_ADDRESS) return balance?.balance.ether;

    const token = balance?.tokens.find(
      (v) => v.address.toLowerCase() === fromToken?.toLowerCase(),
    );
    return token?.balance;
  }, [fromToken, balance]);

  return (
    <YStack p="$4" justify={"center"} height={"100%"} gap={"$2"}>
      <Text>From</Text>
      <Select value={fromToken} onValueChange={setFromToken}>
        <Select.Trigger>
          <Select.Value placeholder="Select a token" />
        </Select.Trigger>

        <Adapt when="maxMd" platform="touch">
          <Sheet modal dismissOnSnapToBottom animation="medium">
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              bg="$shadowColor"
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content>
          <Select.Viewport>
            {fromTokens.map((token, i) => (
              <Select.Item
                index={i}
                key={token.mint + i.toString()}
                value={token.mint}
              >
                <Select.ItemText>
                  <XStack gap={"$2"}>
                    <FastImage
                      source={{ uri: token.logoURI }}
                      style={{ width: 30, height: 30, borderRadius: 100 }}
                    />
                    <YStack>
                      <Text>{token.symbol}</Text>
                      <Text fontSize="$2" color="$color" fontWeight="500">
                        {token.name}
                      </Text>
                    </YStack>
                  </XStack>
                </Select.ItemText>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select>

      <YStack>
        <Input
          value={fromAmount}
          // @ts-expect-error - is going to be of type number
          onChangeText={(text) => setFromAmount(`${text}`)}
          placeholder="0.00"
          keyboardType="numeric"
        />
        <Text
          fontSize="$2"
          opacity={0.8}
          fontWeight="500"
          p={"$2"}
          self={"flex-end"}
        >
          {selectedTokenBalance
            ? `Balance: ${Number(selectedTokenBalance).toLocaleString()}`
            : null}
        </Text>
      </YStack>

      <Text>To</Text>

      <Select value={toToken} onValueChange={setToToken}>
        <Select.Trigger>
          <Select.Value placeholder="Select a token" />
        </Select.Trigger>

        <Adapt when="maxMd" platform="touch">
          <Sheet modal dismissOnSnapToBottom animation="medium">
            <Sheet.Frame>
              <Sheet.ScrollView>
                <Adapt.Contents />
              </Sheet.ScrollView>
            </Sheet.Frame>
            <Sheet.Overlay
              bg="$shadowColor"
              animation="lazy"
              enterStyle={{ opacity: 0 }}
              exitStyle={{ opacity: 0 }}
            />
          </Sheet>
        </Adapt>

        <Select.Content>
          <Select.Viewport>
            <LegendList
              data={toTokens}
              recycleItems
              maintainVisibleContentPosition
              keyExtractor={(token, i) => token.mint + i.toString()}
              renderItem={({ item: token, index: i }) => (
                <Select.Item
                  index={i}
                  value={toChain === "solana" ? token.mint : token.contract}
                >
                  <Select.ItemText>
                    <XStack gap={"$2"}>
                      <FastImage
                        source={{ uri: token.logoURI }}
                        style={{ width: 30, height: 30, borderRadius: 100 }}
                      />
                      <YStack>
                        <Text>{token.symbol}</Text>
                        <Text fontSize="$2" color="$color" fontWeight="500">
                          {token.name}
                        </Text>
                      </YStack>
                    </XStack>
                  </Select.ItemText>
                </Select.Item>
              )}
            />
          </Select.Viewport>
        </Select.Content>
      </Select>
      <Input
        value={toAmount}
        placeholder="0.00"
        editable={false}
        keyboardType="numeric"
      />

      <Text>Bridge Fee: {txFee === "0" ? "Free" : txFee}</Text>
      <Text>Estimated time: {eta ?? 0} seconds</Text>

      <Button onPress={async () => await swap()}>Swap</Button>
    </YStack>
  );
}
