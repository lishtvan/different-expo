import { Button, Text, View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export default function AuthScreen() {
  const signIn = async () => {
    GoogleSignin.configure({
      iosClientId:
        "24434242390-l4r82unf87hh643nmssogggm3grvqcvq.apps.googleusercontent.com",
    });
    const hasPlayService = await GoogleSignin.hasPlayServices();
    if (!hasPlayService) return;
    await GoogleSignin.signIn();
    const { accessToken } = await GoogleSignin.getTokens();
    console.log(accessToken);
  };

  return (
    <View className="bg-yellow-400">
      <Text>Auth tab</Text>
      <Button title={"Sign in with Google"} onPress={signIn} />
    </View>
  );
}
