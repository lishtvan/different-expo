import * as Linking from 'expo-linking';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import { hackyOrderNavigate } from 'utils/navigation';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export function useNotifications() {
  const lastNotificationResponse = Notifications.useLastNotificationResponse();
  useEffect(() => {
    if (
      lastNotificationResponse &&
      lastNotificationResponse.notification.request.content.data.url &&
      lastNotificationResponse.actionIdentifier === Notifications.DEFAULT_ACTION_IDENTIFIER
    ) {
      if (lastNotificationResponse.notification.request.content.data.type === 'order') {
        setTimeout(() => {
          hackyOrderNavigate(lastNotificationResponse.notification.request.content.data.orderId);
        }, 400);
      } else {
        const url = lastNotificationResponse.notification.request.content.data.url;
        setTimeout(() => {
          // TODO: test it in production
          Linking.openURL(url);
        }, 0);
      }
    }
  }, [lastNotificationResponse]);
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
