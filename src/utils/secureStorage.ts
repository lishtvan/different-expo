import * as SecureStore from 'expo-secure-store';

export const saveSession = (token: string) => SecureStore.setItemAsync('token', token);
export const getSession = () => SecureStore.getItemAsync('token');
export const destroySession = () => SecureStore.deleteItemAsync('token');
