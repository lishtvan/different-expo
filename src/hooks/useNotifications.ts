import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { useGlobalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { fetcher } from 'utils/fetcher';

function handleRegistrationError(errorMessage: string) {
  alert(errorMessage);
}

async function registerForPushNotificationsAsync() {
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
    // TODO: change this
    handleRegistrationError('Permission not granted to get push token for push notification!');
    return;
  }
  const projectId = Constants.expoConfig?.extra?.eas?.projectId ?? Constants.easConfig?.projectId;
  if (!projectId) {
    handleRegistrationError('Project ID not found');
  }
  try {
    const pushToken = await Notifications.getExpoPushTokenAsync({
      projectId,
    });
    await fetcher({ route: '/user/update', method: 'POST', body: { pushToken: pushToken.data } });
  } catch (e: unknown) {
    handleRegistrationError(`${e}`);
  }
}

export function useNotifications() {
  useEffect(() => {
    registerForPushNotificationsAsync();
  }, []);
}

const getShouldAlert = (notification: Notifications.Notification, params: any) => {
  const notificationData = notification.request.content.data;
  let shouldAlert = true;
  if (notificationData.type === 'msg' && notificationData.info.chatId === params.chatId) {
    shouldAlert = false;
  }
  return shouldAlert;
};

export function useNotificationHandler() {
  const params = useGlobalSearchParams();
  useEffect(() => {
    Notifications.setNotificationHandler({
      handleNotification: async (notification) => {
        const shouldShowAlert = getShouldAlert(notification, params);
        return { shouldShowAlert, shouldPlaySound: false, shouldSetBadge: false };
      },
    });
  }, [params]);
}

// await Notifications.scheduleNotificationAsync({
//   content: {
//     title: 'Юля Емельяненко',
//     body: 'Бэкстейдж, кстати.',
//     data: {
//       type: 'msg',
//       info: { chatId: 'cd93a362-9bd7-4b35-94b4-e67ffe1f2ab7' },
//     },
//     sound: true,
//   },
//   trigger: { seconds: 4 },
// });
