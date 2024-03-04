import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Link, router, useLocalSearchParams } from 'expo-router';
import parsePhoneNumberFromString, { isValidPhoneNumber } from 'libphonenumber-js';
import { Controller, useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Input, View } from 'tamagui';

import { TUser } from '../../types';
import { transformPhone } from '../../utils/common';
import { fetcher } from '../../utils/fetcher';
import { InputValidationError, validationErrors } from '../ui/InputValidationErrors';

type CreateOrderParams = {
  listingId: string;
  CityRecipient: string;
  RecipientAddress: string;
};

export default function CreateOrder() {
  const { data: user } = useQuery<TUser>({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });

  const params = useLocalSearchParams<CreateOrderParams>();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      firstName: '',
      lastName: '',
      CityRecipient: { ref: '', name: '' },
      RecipientAddress: { ref: '', name: '' },
      phone: user?.phone ? transformPhone.output('+' + user.phone) : '+380',
    },
  });

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: unknown) => fetcher({ route: '/order/create', method: 'POST', body: data }),
    onSuccess: async (res) => {
      if (res.error) {
        // Toast.show({
        //   type: 'error',
        //   text1: 'Будь ласка, виправіть помилки',
        // });
        return;
      }

      await queryClient.invalidateQueries({ queryKey: ['auth_me'] });

      await queryClient.invalidateQueries({ queryKey: ['listing', params.listingId] });
      router.navigate({ pathname: '/orders' });
    },
  });

  const onSubmit = (data: Record<string, unknown>) => {
    const phoneNumberString = parsePhoneNumberFromString(data.phone as string, 'UA');

    if (!phoneNumberString?.isValid()) {
      setError('phone', { type: 'validate' });
      return;
    }

    const phone = parseInt(phoneNumberString!.number, 10);
    mutation.mutate({
      ...data,
      phone,
      listingId: params.listingId,
    });
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      enableResetScrollToCoords={false}
      viewIsInsideTabBar
      keyboardShouldPersistTaps="handled"
      keyboardOpeningTime={0}
      className="flex-1 space-y-3 p-3">
      <View>
        <Controller
          control={control}
          rules={{ required: true }}
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
        {errors.firstName &&
          validationErrors[errors.firstName.type as keyof typeof validationErrors]}
      </View>
      <View>
        <Controller
          control={control}
          rules={{ required: true }}
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
        {errors.lastName && validationErrors[errors.lastName.type as keyof typeof validationErrors]}
      </View>
      <View>
        <Link href={{ pathname: '/create_order/select_city' }} asChild>
          <Pressable>
            <View pointerEvents="none">
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <Input
                    size="$4"
                    autoCorrect={false}
                    borderRadius="$main"
                    placeholder="Населений пункт"
                    className="w-full"
                    value={value}
                  />
                )}
                name="CityRecipient.name"
              />
            </View>
          </Pressable>
        </Link>
      </View>
      <View>
        <Link href={{ pathname: '/create_order/select_department' }} asChild>
          <Pressable>
            <View pointerEvents="none">
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <Input
                    size="$4"
                    autoCorrect={false}
                    borderRadius="$main"
                    placeholder="Відділення Нової Пошти"
                    className="w-full"
                    value={value}
                  />
                )}
                name="RecipientAddress.name"
              />
            </View>
          </Pressable>
        </Link>
      </View>
      <View>
        <Controller
          control={control}
          rules={{
            validate: (value) => {
              if (value.length < 16) return true;
              const valid = isValidPhoneNumber(value, 'UA');
              return valid;
            },
          }}
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
        {errors.phone && <InputValidationError message="Недійсний номер телефону" />}
      </View>
      <View>
        <Button
          onPress={handleSubmit(onSubmit)}
          size="$4"
          theme="active"
          fontSize="$6"
          borderRadius="$main"
          className="mt-2">
          Створити замовлення
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
