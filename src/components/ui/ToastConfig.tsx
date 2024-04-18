import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { mainColor } from 'constants/colors';
import { BaseToastProps, ErrorToast, SuccessToast } from 'react-native-toast-message';

export const toastConfig = {
  success: (props: BaseToastProps & { props: any }) => {
    return (
      <SuccessToast
        {...props}
        style={{
          height: props.props.height || 50,
          borderLeftColor: 'white',
          borderRadius: 15,
          justifyContent: 'center',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 2,
          alignItems: 'center',
          paddingHorizontal: props.props.paddingHorizontal || 25,
          marginTop: 13,
        }}
        text1NumberOfLines={5}
        contentContainerStyle={{
          paddingHorizontal: 0,
        }}
        renderTrailingIcon={() => (
          <Ionicons
            name="checkmark-circle-sharp"
            style={{ marginBottom: 1 }}
            size={28}
            color={mainColor}
          />
        )}
        text1Style={{
          fontSize: 16,
          fontWeight: '500',
        }}
      />
    );
  },

  error: (props: BaseToastProps & { props: any }) => {
    return (
      <ErrorToast
        {...props}
        style={{
          height: props.props.height || 50,
          borderLeftColor: 'white',
          borderRadius: 15,
          justifyContent: 'center',
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.4,
          shadowRadius: 6,
          elevation: 2,
          alignItems: 'center',
          paddingHorizontal: props.props.paddingHorizontal || 25,
          marginTop: 13,
        }}
        text1NumberOfLines={5}
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
