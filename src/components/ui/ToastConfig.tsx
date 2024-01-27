import { MaterialIcons } from '@expo/vector-icons';
import { BaseToast, BaseToastProps, ErrorToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: BaseToastProps) => (
    <BaseToast
      {...props}
      text1Style={{
        fontSize: 16,
        fontWeight: '600',
      }}
    />
  ),

  error: (props: BaseToastProps) => {
    return (
      <ErrorToast
        {...props}
        style={{
          borderLeftColor: 'white',
          borderRadius: 15,
          justifyContent: 'center',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 2,
          alignItems: 'center',
          paddingHorizontal: 25,
          marginTop: 25,
        }}
        contentContainerStyle={{
          paddingHorizontal: 0,
        }}
        renderTrailingIcon={() => (
          <MaterialIcons name="error" style={{ marginBottom: 1 }} size={28} color="red" />
        )}
        text1Style={{
          fontSize: 16,
          fontWeight: '500',
        }}
      />
    );
  },
};
