import { Alert } from 'react-native';

export const openConfirmationModal = (msg: string, onConfirm: () => void) => {
  Alert.alert(msg, '', [
    { text: 'Ні', onPress: () => {}, style: 'cancel' },
    { text: 'Так', onPress: onConfirm },
  ]);
};
