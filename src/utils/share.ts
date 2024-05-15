import { Alert, Share } from 'react-native';

export const shareLink = async (link: string) => {
  try {
    await Share.share({ message: `https://different.to/${link}` });
  } catch (error: any) {
    Alert.alert(error.message);
  }
};
