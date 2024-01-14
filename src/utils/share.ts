import { Alert, Share } from 'react-native';

export const shareLink = async (link: string) => {
  try {
    const result = await Share.share({ message: `https://different.to/${link}` });
    if (result.action === Share.sharedAction) {
      if (result.activityType) {
        // shared with activity type of result.activityType
      } else {
        // shared
      }
    } else {
      // dismissed
    }
  } catch (error: any) {
    Alert.alert(error.message);
  }
};
