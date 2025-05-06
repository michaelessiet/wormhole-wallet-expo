import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button, Text } from "tamagui";

export default function Onboarding() {
  return (
    <SafeAreaView>
      <Text color={"red"}>Auth</Text>
      <Button asChild>
        <Link href="/modal">
          <Text color={"$green9"}>Go to Overview</Text>
        </Link>
      </Button>
    </SafeAreaView>
  );
}
