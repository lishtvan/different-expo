import { Ionicons } from '@expo/vector-icons';
import { onlineManager } from '@tanstack/react-query';
import { ErrorBoundaryProps } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';
import { SafeAreaView, Text, View } from 'react-native';
import { Button, Spinner, TamaguiProvider, Theme } from 'tamagui';

import tamaguiConfig from '../../../tamagui.config';

const NotFoundError = (props: ErrorBoundaryProps) => {
  return (
    <SafeAreaView className="flex-1 items-center">
      <View className="rounded-3xl bg-red-100 px-4 py-1.5">
        <Text className="text-lg font-semibold">Помилка 404</Text>
      </View>
      <View className="flex-1 justify-center px-5">
        <Text className="text-xl font-medium">
          Те що ви шукали - не знайдено.{'\n'}Якщо це здається вам помилкою, зверніться в підтримку.
        </Text>
      </View>
      <View className="flex-row gap-x-4">
        <Button onPress={props.retry} size="$5" fontSize="$6" borderRadius="$main">
          Повернутись
        </Button>
        <Button
          onPress={() => WebBrowser.openBrowserAsync(`https://t.me/DifferentMarketplace`)}
          size="$5"
          fontSize="$6"
          borderRadius="$main">
          Підтримка
        </Button>
      </View>
    </SafeAreaView>
  );
};

const InternalError = (props: ErrorBoundaryProps) => {
  return (
    <SafeAreaView className="flex-1 items-center">
      <View className="rounded-3xl bg-red-100 px-4 py-1.5">
        <Text className="text-lg font-semibold">Помилка 500</Text>
      </View>
      <View className="flex-1 justify-center px-5">
        <Text className="text-xl font-medium">
          Щось пішло не так з нашої сторони.{'\n'}Будь ласка, напишіть в підтримку.
        </Text>
      </View>
      <View className="flex-row gap-x-4">
        <Button onPress={props.retry} size="$5" fontSize="$6" borderRadius="$main">
          Повернутись
        </Button>
        <Button
          onPress={() => WebBrowser.openBrowserAsync(`https://t.me/DifferentMarketplace`)}
          size="$5"
          fontSize="$6"
          borderRadius="$main">
          Підтримка
        </Button>
      </View>
    </SafeAreaView>
  );
};

const NoInternetError = (props: ErrorBoundaryProps) => {
  const [checking, setChecking] = useState(false);
  const checkConnection = async () => {
    setChecking(true);
    try {
      await fetch('https://jsonplaceholder.typicode.com/todos/1');
      props.retry();
      setTimeout(() => {
        onlineManager.setOnline(true);
      }, 1000);
    } catch {
      setTimeout(() => {
        setChecking(false);
      }, 1000);
    }
  };

  return (
    <SafeAreaView className="flex-1 items-center">
      <View className="rounded-3xl bg-red-100 px-4 py-1.5">
        <Text className="text-lg font-semibold">Немає мережі</Text>
      </View>
      <View className="flex-1 flex-row items-center justify-center gap-x-2 px-5">
        <Button
          iconAfter={
            checking ? (
              <Spinner />
            ) : (
              <Ionicons name="reload-sharp" style={{ marginTop: 2 }} size={20} />
            )
          }
          onPress={checkConnection}
          size="$5"
          fontSize="$6"
          borderRadius="$main">
          Перевірити з&apos;єднання
        </Button>
      </View>
    </SafeAreaView>
  );
};

export function ErrorBoundary(props: ErrorBoundaryProps) {
  return (
    <TamaguiProvider config={tamaguiConfig}>
      <Theme name="light">
        {props.error.message === 'Network request failed' ? (
          <NoInternetError {...props} />
        ) : props.error.cause === 404 ? (
          <NotFoundError {...props} />
        ) : (
          <InternalError {...props} />
        )}
      </Theme>
    </TamaguiProvider>
  );
}
