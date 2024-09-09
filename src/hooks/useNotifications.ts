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
      const { type, url, orderId } = lastNotificationResponse.notification.request.content.data;
      setTimeout(() => {
        // TODO: test it in production
        if (type === 'order') hackyOrderNavigate(orderId);
        else Linking.openURL(url);
      }, 0);
    }
  }, [lastNotificationResponse]);
}
