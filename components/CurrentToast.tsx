import { Toast, useToastController, useToastState } from "@tamagui/toast";
import { Button, H4, Spinner, XStack, YStack, isWeb } from "tamagui";

export function CurrentToast() {
  const currentToast = useToastState();

  if (!currentToast || currentToast.isHandledNatively) return null;

  return (
    <Toast
      key={currentToast.id}
      duration={
        currentToast.customData?.spinner
          ? Number.POSITIVE_INFINITY
          : currentToast.duration
      }
      viewportName={currentToast.viewportName}
      enterStyle={{ opacity: 0, scale: 0.5, y: -25 }}
      exitStyle={{ opacity: 0, scale: 1, y: -20 }}
      y={isWeb ? "$12" : 0}
      theme={currentToast.customData?.type === "error" ? "red" : "blue"}
      rounded="$6"
      animation="quick"
    >
      <XStack items={"center"} gap={"$3"}>
        {currentToast.customData?.spinner && <Spinner />}

        <YStack p="$1">
          <Toast.Title fontWeight="bold">{currentToast.title}</Toast.Title>
          {!!currentToast.message && (
            <Toast.Description>{currentToast.message}</Toast.Description>
          )}
        </YStack>
      </XStack>
    </Toast>
  );
}

export function ToastControl() {
  const toast = useToastController();

  return (
    <YStack gap="$2" items="center">
      <H4>Toast demo</H4>
      <XStack gap="$2" justify="center">
        <Button
          onPress={() => {
            toast.show("Successfully saved!", {
              message: "Don't worry, we've got your data.",
            });
          }}
        >
          Show
        </Button>
        <Button
          onPress={() => {
            toast.hide();
          }}
        >
          Hide
        </Button>
      </XStack>
    </YStack>
  );
}
