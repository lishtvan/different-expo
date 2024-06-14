import * as Notifications from 'expo-notifications';
import { useGlobalSearchParams } from 'expo-router';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from 'utils/notifications';

export function useNotifications() {
  useEffect(() => {
    registerForPushNotificationsAsync({ shouldOpenModalIfNotGranted: false });
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
