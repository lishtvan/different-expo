import { Redirect, useLocalSearchParams } from 'expo-router';
import React from 'react';

import User from '../../../components/user/User';

export default function ProfileScreen() {
  const params = useLocalSearchParams();
  if (!params?.nickname) {
    return <Redirect href="/auth" />;
  }
  return <User />;
}
