import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Alert, Linking, Platform } from 'react-native';
import { fetcher } from 'utils/fetcher';

import { getSession } from './secureStorage';

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
}

export async function registerForPushNotificationsAsync({ shouldOpenModalIfNotGranted = false }) {
  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    if (!shouldOpenModalIfNotGranted) return { granted: false };
    Alert.alert(
      'Увімкніть сповіщення',
      'Це є важливим для швидкої комунікації між продавцем та покупцем',
      [
        {
          text: 'Відкрити налаштування',
          onPress: () => Linking.openSettings(),
          isPreferred: true,
        },
        { text: 'Скасувати', onPress: () => {} },
      ]
    );
    return { granted: false };
  }
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError('Project ID not found');
  }
  try {
    const pushToken = await Notifications.getExpoPushTokenAsync({ projectId });
    const session = await getSession();
    if (session) {
      await fetcher({ route: '/user/update', method: 'POST', body: { pushToken: pushToken.data } });
    }
    return { granted: true };
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
    return { granted: false };
  }
}
