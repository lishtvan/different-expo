import * as SecureStore from "expo-secure-store";

export const saveSession = (token: string, userId: number) =>
  SecureStore.setItemAsync("session", JSON.stringify({ token, userId }));
export const getSession = () => SecureStore.getItemAsync("session");
export const destroySession = () => SecureStore.deleteItemAsync("session");
