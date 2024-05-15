import NetInfo from '@react-native-community/netinfo';
import { onlineManager } from '@tanstack/react-query';
import React from 'react';

export function useOnlineManager() {
  React.useEffect(() => {
    return NetInfo.addEventListener((state) => {
      onlineManager.setOnline(
        state.isConnected != null && state.isConnected && Boolean(state.isInternetReachable)
      );
    });
  }, []);
}
