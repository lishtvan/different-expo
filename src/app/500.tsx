import { Link, Stack } from "expo-router";
import { StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen
        options={{ title: "Помилка 500", headerShadowVisible: false }}
      />
      <View style={styles.container}>
        <Text style={styles.title}>Щось пішло не так</Text>
        <Link href="/" style={styles.link}>
          <Text className="text-main" style={styles.linkText}>
            Перейти на головну сторінку
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
  },
});
