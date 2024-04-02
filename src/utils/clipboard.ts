import * as Clipboard from 'expo-clipboard';
import Toast from 'react-native-toast-message';

export const copyText = async (text: string) => {
  await Clipboard.setStringAsync(text);
  Toast.show({
    visibilityTime: 1500,
    type: 'success',
    text1: 'Текст скопійовано',
  });
};
