import { useLocalSearchParams } from 'expo-router';
import { AsYouType } from 'libphonenumber-js';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Input, View } from 'tamagui';

type CreateOrderParams = {
  listingId: string;
  CityRecipient: string;
  RecipientAddress: string;
};

// TODO: move this to utils
const transformPhone = {
  output: (text: string) => {
    return new AsYouType().input(text);
  },
};

export default function CreateOrder() {
  const params = useLocalSearchParams<CreateOrderParams>();
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    setValue,
    reset,
    clearErrors,
    setError,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      CityRecipient: '',
      RecipientAddress: '',
      phone: '+380',
    },
  });

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableResetScrollToCoords={false}
      viewIsInsideTabBar
      keyboardShouldPersistTaps="handled"
      keyboardOpeningTime={0}
      className="flex-1 gap-y-3 p-3">
      <View className=" animate-ping">
        <Controller
          control={control}
          rules={{ required: true, maxLength: 80 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="$4"
              borderRadius="$main"
              placeholder="Ім`я"
              className="w-full"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="firstName"
        />
      </View>
      <View>
        <Controller
          control={control}
          rules={{ required: true, maxLength: 80 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="$4"
              accessibilityLanguage="ua"
              borderRadius="$main"
              placeholder="Прізвище"
              className="w-full"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="lastName"
        />
      </View>
      <View>
        <Controller
          control={control}
          rules={{ required: true, maxLength: 80 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="$4"
              autoCorrect={false}
              borderRadius="$main"
              placeholder="Введіть номер телефону"
              className="w-full"
              keyboardType="number-pad"
              onBlur={onBlur}
              onChangeText={(text) => {
                if (text.length < 4 || text.length > 16) return;
                onChange(text);
              }}
              value={transformPhone.output(value)}
            />
          )}
          name="phone"
        />
      </View>
    </KeyboardAwareScrollView>
  );
}
