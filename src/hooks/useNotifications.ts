import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { registerForPushNotificationsAsync } from 'utils/notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  useEffect(() => {
    const subscription = Notifications.addPushTokenListener(() => {
      registerForPushNotificationsAsync({ shouldOpenModalIfNotGranted: false });
    });
    return () => subscription.remove();
  }, []);
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
