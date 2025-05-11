import FastImage from "@d11/react-native-fast-image";
import { LegendList } from "@legendapp/list";
import { ChainName } from "@mayanfinance/swap-sdk";
import {
  blockchains,
  blockchainsToMayanFinanceChainIds,
} from "constants/mayanFinance";
import useMayanFinance from "hooks/useMayanFinance";
import { useEffect } from "react";
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
    setToChain,
    toToken,
    setToToken,
    toTokens,
    toChain,
    swap,
    txFee,
  } = useMayanFinance();

  // swap form in tamagui
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
                  <XStack>
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

      <Input
        value={fromAmount}
        // @ts-expect-error - is going to be of type number
        onChangeText={(text) => setFromAmount(`${text}`)}
        placeholder="0.00"
        keyboardType="numeric"
      />

      <Text>To</Text>

      <Select
        value={toChain}
        onValueChange={(chain) => setToChain(chain as ChainName)}
      >
        <Select.Trigger>
          <Select.Value placeholder="Select a chain" />
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
              data={blockchains}
              keyExtractor={(chain, i) => chain + i.toString()}
              renderItem={({ item: chain, index: i }) => (
                <Select.Item index={i} value={chain}>
                  <Select.ItemText>
                    <XStack gap={"$2"}>
                      <YStack>
                        <Text>{chain}</Text>
                      </YStack>
                    </XStack>
                  </Select.ItemText>
                </Select.Item>
              )}
            />
          </Select.Viewport>
        </Select.Content>
      </Select>

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

      <Button onPress={async () => await swap()}>Swap</Button>
    </YStack>
  );
}
