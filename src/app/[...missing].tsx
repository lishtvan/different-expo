import { Foundation, Ionicons } from '@expo/vector-icons';
import { Stack, router } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Button, Text, View } from 'tamagui';

export default function NotFoundScreen() {
  const canGoBack = router.canGoBack();

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Помилка 404',
          headerShadowVisible: false,
          headerBackTitleVisible: false,
          headerBackVisible: false,
        }}
      />
      <View className="mt-10 flex-1 items-center justify-center gap-y-4">
        <Text style={styles.title}>Сторінку не знайдено</Text>
        <Button
          onPress={() => {
            if (canGoBack) router.back();
            else router.navigate('/');
          }}
          icon={() =>
            canGoBack ? (
              <Ionicons name="arrow-back-circle-sharp" size={26} />
            ) : (
              <Foundation name="home" size={25} />
            )
          }
          size="$5"
          fontSize="$6"
          borderRadius="$main">
          {canGoBack ? 'Повернутися' : 'На головну'}
        </Button>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
