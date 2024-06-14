import { router } from 'expo-router';

// Github issue https://github.com/expo/expo/issues/26211
export const hackyOrderNavigate = (orderId: string) => {
  router.navigate('/orders/');
  setTimeout(() => {
    router.navigate({
      pathname: '/orders/order',
      params: { orderId },
    });
  }, 100);
};
