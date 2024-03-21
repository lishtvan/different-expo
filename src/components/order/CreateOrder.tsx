import { Foundation } from '@expo/vector-icons';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Image } from 'expo-image';
import { Link, router, useLocalSearchParams } from 'expo-router';
import parsePhoneNumberFromString, { isValidPhoneNumber } from 'libphonenumber-js';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Pressable } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Button, Input, Text, View } from 'tamagui';

import { TUser } from '../../types';
import { fixedEncodeURIComponent, transformPhone } from '../../utils/common';
import { fetcher } from '../../utils/fetcher';
import { InputValidationError, validationErrors } from '../ui/InputValidationErrors';

type CreateOrderParams = {
  listingId: string;
  cityRef?: string;
  cityName?: string;
  departmentName?: string;
  departmentRef?: string;
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
    setValue,
    clearErrors,
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

  useEffect(() => {
    if (params.cityRef && params.cityName) {
      setValue('CityRecipient', { name: params.cityName, ref: params.cityRef });
      if (errors.CityRecipient?.name) clearErrors('CityRecipient.name');
    }
    if (params.departmentRef && params.departmentName) {
      setValue('RecipientAddress', { name: params.departmentName, ref: params.departmentRef });
      if (errors.RecipientAddress?.name) clearErrors('RecipientAddress.name');
    }
  }, [params]);

  const onSubmit = (data: any) => {
    const phoneNumberString = parsePhoneNumberFromString(data.phone as string, 'UA');

    if (!phoneNumberString?.isValid()) {
      setError('phone', { type: 'validate' });
      return;
    }

    const phone = parseInt(phoneNumberString.number, 10).toString();

    mutation.mutate({
      CityRecipient: data.CityRecipient.ref,
      RecipientAddress: data.RecipientAddress.name,
      RecipientsPhone: phone,
      firstName: data.firstName,
      lastName: data.lastName,
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
        <Link
          href={{ pathname: '/create_order/select_city', params: { listingId: params.listingId } }}
          asChild>
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
                    selection={{ start: 0 }}
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
        {errors.CityRecipient?.name &&
          validationErrors[errors.CityRecipient.name.type as keyof typeof validationErrors]}
      </View>
      <View>
        <Link
          href={{
            pathname: params.cityRef
              ? '/create_order/select_department'
              : '/create_order/select_city',
            params: {
              listingId: params.listingId,
              cityRef: params.cityRef!,
              cityName: fixedEncodeURIComponent(params.cityName as string),
            },
          }}
          asChild>
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
                    selection={{ start: 0 }}
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
        {errors.RecipientAddress?.name &&
          validationErrors[errors.RecipientAddress.name.type as keyof typeof validationErrors]}
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
      <View className="flex-1 flex-row items-center justify-between px-3">
        <Foundation name="shield" size={38} />
        <Image
          style={{ width: 53, height: 53 }}
          source={require('../../../assets/images/novaposhta.png')}
        />
        <Text className="text-base px-4">
          Ваші покупки захищені послугою {'\n'}
          <Text className="font-semibold">Cейф-сервіс</Text> від Нової Пошти.{'\n'}
          <Link
            style={{ textDecorationLine: 'underline' }}
            className="font-semibold text-blue-600 "
            href="/buyer_sf_details">
            Як це працює?
          </Link>
        </Text>
      </View>
      <View>
        <Button
          onPress={handleSubmit(onSubmit)}
          size="$4"
          theme="active"
          fontSize="$6"
          borderRadius="$main"
          className="mt-2 mb-20">
          Створити замовлення
        </Button>
      </View>
    </KeyboardAwareScrollView>
  );
}
