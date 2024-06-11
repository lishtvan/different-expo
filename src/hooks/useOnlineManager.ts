import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import React from 'react';
import Toast from 'react-native-toast-message';

export function useOnlineManager() {
  React.useEffect(() => {
    return NetInfo.addEventListener((state) => {
      onlineManager.setOnline(!!state.isConnected);
      if (!state.isConnected) {
        Toast.show({
          type: 'error',
          text1: 'Відсутнє інтернет зʼєднання',
          autoHide: false,
          position: 'bottom',
          bottomOffset: 30,
        });
      } else Toast.hide();
    });
  }, []);
}
