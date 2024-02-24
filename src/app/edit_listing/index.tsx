import { AntDesign } from '@expo/vector-icons';
import { MenuView } from '@react-native-menu/menu';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import validateCard from 'card-validator';
import { Link, router, useLocalSearchParams } from 'expo-router';
import parsePhoneNumberFromString, { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';
import { FC, useCallback, useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { Button, Input, Text, View } from 'tamagui';

import { mainColor } from '../../../tamagui.config';
import Photos from '../../components/sell/Photos';
import { InputValidationError, validationErrors } from '../../components/ui/InputValidationErrors';
import TextArea from '../../components/ui/TextArea';
import { CONDITIONS, TAGS } from '../../constants/listing';
import { ListingResponse, SelectedImage, TListing } from '../../types';
import { fetcher } from '../../utils/fetcher';

const transformPhone = {
  output: (text: string) => {
    return new AsYouType().input(text);
  },
};

type EditListingParams = {
  designer?: string;
  listingId: string;
  size?: string;
  category?: string;
};

interface SaveListingProps {
  listing: Partial<TListing<number>>;
  user: {
    phone: string;
    cardNumber: string;
  };
}

const SaveListing: FC<SaveListingProps> = ({ listing, user }) => {
  const params = useLocalSearchParams<EditListingParams>();

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
      designer: listing.designer,
      title: listing.title,
      price: listing.price?.toString(),
      description: listing.description,
      condition: listing.condition,
      category: listing.category,
      size: listing.size,
      phone: user.phone ? transformPhone.output('+' + user.phone) : '+380',
      cardNumber: user.cardNumber,
    },
  });

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>(() =>
    listing.imageUrls!.map((i) => ({
      isPreview: false,
      imageUrl: i,
    }))
  );
  const updateSelectedImages = useCallback((urls: SelectedImage[]) => {
    setSelectedImages(urls);
  }, []);

  const [selectedTags, setSelectedTags] = useState<string[]>(listing.tags || []);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: unknown) =>
      fetcher({
        route: !listing.id ? '/listing/create' : '/listing/update',
        method: 'POST',
        body: data,
      }),
    onSuccess: async (res) => {
      if (res.error) {
        Toast.show({
          type: 'error',
          text1: 'Будь ласка, виправіть помилки',
        });
        return;
      }

      if (!listing.id) {
        router.setParams({ designer: '', size: '', category: '' });
        reset();
        setSelectedTags([]);
        updateSelectedImages([]);
        router.navigate({ pathname: `/listing/${res.listingId}` });
      } else {
        await queryClient.invalidateQueries({ queryKey: ['listing', listing.id.toString()] });
        router.back();
      }
    },
  });

  const [open, setOpen] = useState(false);
  const [tags, setTags] = useState(() => TAGS.map((tag) => ({ label: tag, value: tag })));

  useEffect(() => {
    if (selectedTags.length === 3) setOpen(false);
  }, [selectedTags]);

  useEffect(() => {
    if (params.designer) {
      setValue('designer', params.designer);
      if (errors.designer) clearErrors('designer');
    }
    if (params.size && params.category) {
      setValue('category', params.category);
      // @ts-expect-error its okay
      setValue('size', params.size);

      if (errors.category) clearErrors('category');
      if (errors.size) clearErrors('size');
    }
  }, [params]);

  const onSubmit = (data: Record<string, unknown>) => {
    const { isValid } = validateCard.number(data.cardNumber);
    const phoneNumberString = parsePhoneNumberFromString(data.phone as string, 'UA');
    let isError;
    if (!isValid) {
      setError('cardNumber', { type: 'validate', message: 'Недійсний номер карти' });
      isError = true;
    }
    if (!phoneNumberString?.isValid()) {
      setError('phone', { type: 'validate' });
      isError = true;
    }
    if (isError) return;

    const phone = parseInt(phoneNumberString!.number, 10);
    const cardNumber = (data.cardNumber as string).replace(/ /g, '');

    mutation.mutate({
      ...data,
      imageUrls: selectedImages.map((img) => {
        if (img.isPreview) return;
        return img.imageUrl;
      }),
      cardNumber,
      phone,
      tags: selectedTags,
      listingId: listing.id,
    });
  };

  const hideKeyboardIfVisible = () => {
    if (Keyboard.isVisible()) Keyboard.dismiss();
  };

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      keyboardShouldPersistTaps="handled"
      extraScrollHeight={100}
      className="flex-1 gap-y-3 p-3">
      <View>
        <Text className="mb-1 ml-2 text-base">Заголовок *</Text>
        <Controller
          control={control}
          rules={{ required: true, maxLength: 80 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="$4"
              autoCorrect={false}
              borderRadius="$main"
              placeholder="Введіть заголовок"
              className="w-full"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="title"
        />
        {errors.title && validationErrors[errors.title.type as keyof typeof validationErrors]}
      </View>
      <View>
        <Text className="mb-1 ml-2 text-base">Дизайнер *</Text>
        <Link
          href={{
            pathname: '/edit_listing/designer_search',
            params: { listingId: params.listingId },
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
                    placeholder="Оберіть дизайнера"
                    className="w-full"
                    value={value}
                  />
                )}
                name="designer"
              />
              {errors.designer &&
                validationErrors[errors.designer.type as keyof typeof validationErrors]}
            </View>
          </Pressable>
        </Link>
      </View>
      <View>
        <Text className="mb-1 ml-2 text-base">Категорія та розмір *</Text>
        <Link
          href={{
            pathname: '/edit_listing/select_category_and_size',
            params: { listingId: params.listingId },
          }}
          asChild>
          <Pressable onPress={hideKeyboardIfVisible}>
            <View pointerEvents="none">
              <Controller
                control={control}
                rules={{ required: true }}
                render={({ field: { value } }) => (
                  <Input
                    size="$4"
                    borderRadius="$main"
                    placeholder="Оберіть категорію та розмір"
                    className="w-full"
                    value={`${getValues('category')}, ${value}`}
                  />
                )}
                name="size"
              />
              {errors.designer &&
                validationErrors[errors.designer.type as keyof typeof validationErrors]}
            </View>
          </Pressable>
        </Link>
      </View>
      <View>
        <Photos
          error={mutation.data?.errors?.imageUrls}
          selectedImages={selectedImages}
          updateSelectedImages={updateSelectedImages}
        />
      </View>
      <View>
        <Text className="mb-1 ml-2 text-base">Опис</Text>
        <Controller
          control={control}
          rules={{ maxLength: 1000 }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextArea
              height={100}
              placeholder="Додайте більше інформації про стан речі, її посадку, розміри, досвід використання, матеріали, тощо."
              className="w-full"
              numberOfLines={3}
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="description"
        />
        {errors.description &&
          validationErrors[errors.description.type as keyof typeof validationErrors]}
      </View>
      <View>
        <Text className="mb-1 ml-2 text-base">Теги</Text>
        <DropDownPicker
          open={open}
          multiple
          max={3}
          closeAfterSelecting
          placeholder="Зробіть пошук свого оголошення простішим"
          dropDownDirection="TOP"
          showBadgeDot={false}
          mode="BADGE"
          placeholderStyle={{ color: '#8f8f8f', paddingLeft: 6 }}
          arrowIconStyle={{ marginRight: 6 }}
          dropDownContainerStyle={{ borderColor: '#ebebeb', borderRadius: 16 }}
          style={{ backgroundColor: '#f8f8f8', borderRadius: 16, borderColor: '#ebebeb' }}
          badgeDotColors={[mainColor]}
          containerStyle={{ borderRadius: 16, backgroundColor: '#f8f8f8' }}
          TickIconComponent={() => <AntDesign color={mainColor} name="check" size={23} />}
          value={selectedTags}
          items={tags}
          props={{ activeOpacity: 0.5 }}
          setOpen={setOpen}
          setValue={setSelectedTags}
          setItems={setTags}
          listMode="SCROLLVIEW"
        />
      </View>
      <View>
        <Text className="mb-1 ml-2 text-base">Стан речі *</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          name="condition"
          render={({ field: { onChange, value } }) => (
            <MenuView
              onPressAction={({ nativeEvent }) => {
                onChange(nativeEvent.event);
              }}
              actions={CONDITIONS.map((c) => ({ id: c, title: c }))}>
              <Pressable>
                <View pointerEvents="none">
                  <Input
                    size="$4"
                    borderRadius="$main"
                    placeholder="Будьте чесними"
                    className="w-full"
                    value={value}
                  />
                </View>
              </Pressable>
            </MenuView>
          )}
        />
        {errors.condition &&
          validationErrors[errors.condition.type as keyof typeof validationErrors]}
      </View>
      <View>
        <Text className="mb-1 ml-2 text-base">Ціна *</Text>
        <Controller
          control={control}
          rules={{
            required: true,
            min: 1,
            max: 300000,
            pattern: {
              value: /^[0-9]+$/,
              message: 'Дозволено лише цілі числа',
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="$4"
              keyboardType="number-pad"
              autoCorrect={false}
              borderRadius="$main"
              placeholder="Введіть ціну в гривнях"
              className="w-full"
              onBlur={onBlur}
              value={value}
              onChangeText={(text) => {
                if (text.length === 1 && text === '0') return;
                onChange(text);
              }}
            />
          )}
          name="price"
        />
        {errors.price?.message && <InputValidationError message={errors.price.message} />}
        {errors.price &&
          errors.price.type !== 'pattern' &&
          validationErrors[errors.price.type as keyof typeof validationErrors]}
      </View>
      <View>
        <Text className="mb-1 ml-2 text-base">Номер телефону *</Text>
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
      <View className="mb-4">
        <Text className="mb-1 ml-2 text-base">Номер карти *</Text>
        <Controller
          control={control}
          rules={{
            required: 'Це поле є обовʼязковим.',
            validate: (value) => {
              const { card, isPotentiallyValid } = validateCard.number(value);
              if (!isPotentiallyValid) return 'Недійсний номер карти.';
              if (!card) return true;
              if (card.niceType === 'Visa' || card.niceType === 'Mastercard') return true;
              return 'Дозволені лише картки Visa та Mastercard.';
            },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              size="$4"
              autoCorrect={false}
              borderRadius="$main"
              keyboardType="number-pad"
              placeholder="Введіть номер банківської карти"
              className="w-full"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
            />
          )}
          name="cardNumber"
        />
        {errors.cardNumber && <InputValidationError message={errors.cardNumber.message!} />}
      </View>
      <Button
        onPress={handleSubmit(onSubmit)}
        size="$4"
        theme="active"
        fontSize="$6"
        borderRadius="$main"
        className="mb-24">
        {listing.id ? 'Зберегти' : 'Створити'}
      </Button>
    </KeyboardAwareScrollView>
  );
};

export default function EditListing() {
  const params = useLocalSearchParams<EditListingParams>();

  const user = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });

  const listingResponse = useQuery<ListingResponse>({
    queryKey: ['listing', params.listingId],
    queryFn: () => fetcher({ body: { listingId: params.listingId }, route: '/listing/get' }),
  });

  if (listingResponse.isLoading || user.isLoading || !listingResponse.data || !user.data)
    return null;

  return (
    <SaveListing
      listing={listingResponse.data.listing}
      user={{ cardNumber: user.data.cardNumber, phone: user.data.phone }}
    />
  );
}
