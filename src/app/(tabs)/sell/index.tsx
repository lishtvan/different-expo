import { AntDesign, Entypo } from '@expo/vector-icons';
import { useMutation, useQuery } from '@tanstack/react-query';
import validateCard from 'card-validator';
import { Link, Redirect, router, useLocalSearchParams } from 'expo-router';
import parsePhoneNumberFromString, { AsYouType, isValidPhoneNumber } from 'libphonenumber-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, Pressable, TouchableOpacity } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import Toast from 'react-native-toast-message';
import { Adapt, Button, Input, ListItem, Select, Separator, Sheet, Text, View } from 'tamagui';

import { mainColor } from '../../../../tamagui.config';
import Photos from '../../../components/sell/Photos';
import {
  InputValidationError,
  validationErrors,
} from '../../../components/ui/InputValidationErrors';
import TextArea from '../../../components/ui/TextArea';
import { CATEGORIES, CONDITIONS, SIZES, Section, TAGS } from '../../../constants/listing';
import { SelectedImage } from '../../../types';
import { fetcher } from '../../../utils/fetcher';

const getSectionByCategory = (category: string) => {
  const section = Object.keys(CATEGORIES).find((key) =>
    CATEGORIES[key as Section].includes(category)
  );
  return section;
};

const transformPhone = {
  output: (text: string) => {
    return new AsYouType().input(text);
  },
};

export default function SellScreen() {
  const params = useLocalSearchParams<{ designer: string }>();
  const user = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
    setValue,
    reset,
    resetField,
    clearErrors,
    setError,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      designer: '',
      title: '',
      price: '',
      description: '',
      condition: '',
      category: '',
      size: '',
      phone: user.data?.phone ? transformPhone.output('+' + user.data.phone) : '+380',
      cardNumber: (user.data?.cardNumber as string) || '',
    },
  });

  const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
  const updateSelectedImages = useCallback((urls: SelectedImage[]) => {
    setSelectedImages(urls);
  }, []);

  const mutation = useMutation({
    mutationFn: (data: unknown) =>
      fetcher({
        route: '/listing/create',
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

      reset();
      updateSelectedImages([]);
      router.navigate({ pathname: `/listing/${res.listingId}` });
    },
  });

  const [open, setOpen] = useState(false);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [tags, setTags] = useState(() => TAGS.map((tag) => ({ label: tag, value: tag })));
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const watchCategory = watch('category');
  const sectionByCategory = useMemo(() => getSectionByCategory(watchCategory), [watchCategory]);

  useEffect(() => {
    if (selectedTags.length === 3) setOpen(false);
  }, [selectedTags]);

  useEffect(() => {
    if (!params.designer) return;
    setValue('designer', params.designer);
    if (errors.designer) clearErrors('designer');
  }, [params]);

  useEffect(() => {
    if (watchCategory) resetField('size');
  }, [watchCategory]);

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
    });
  };

  const hideKeyboardIfVisible = () => {
    if (Keyboard.isVisible()) Keyboard.dismiss();
  };

  if (user.isLoading) return null;
  if (!user.data) return <Redirect href="/auth" />;

  return (
    <KeyboardAwareScrollView
      viewIsInsideTabBar
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
        <Link href="/sell/designer_search" asChild>
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
        <Text className="mb-1 ml-2 text-base">Категорія *</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          name="category"
          render={({ field: { onChange, value } }) => (
            <Select onOpenChange={hideKeyboardIfVisible} value={value} onValueChange={onChange}>
              <Select.Trigger
                borderRadius="$main"
                iconAfter={<Entypo name="chevron-thin-down" size={16} />}>
                <Select.Value
                  className={`${getValues().category ? 'text-black' : 'text-[#979797]'}`}
                  placeholder="Оберіть категорію"
                />
              </Select.Trigger>
              <Adapt when="sm" platform="native">
                <Sheet
                  native
                  snapPoints={[50]}
                  modal
                  dismissOnSnapToBottom
                  animationConfig={{
                    type: 'spring',
                    damping: 150,
                    mass: 1.2,
                    stiffness: 450,
                  }}>
                  <Sheet.Frame className="rounded-none">
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Handle />
                  <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                </Sheet>
              </Adapt>
              <Select.Content>
                <Select.Viewport>
                  <Select.Group>
                    {!selectedSection && (
                      <>
                        <View className="p-4">
                          <Text className="text-lg font-bold">Оберіть секцію</Text>
                        </View>

                        {(Object.keys(CATEGORIES) as Section[]).map((section) => (
                          <View key={section}>
                            <ListItem
                              className="bg-[#f8f8f8] py-2"
                              pressStyle={{ backgroundColor: '#f0f0f0' }}
                              onPress={() => setSelectedSection(section)}>
                              <ListItem.Text className="text-base">{section}</ListItem.Text>
                            </ListItem>
                            <Separator borderWidth={1} />
                          </View>
                        ))}
                      </>
                    )}
                    {selectedSection && (
                      <>
                        <View className="flex-row items-center justify-between p-4">
                          <Text className="text-lg font-bold">Оберіть категорію</Text>
                          <TouchableOpacity onPress={() => setSelectedSection(null)}>
                            <Text className="text-base text-main">Повернутись</Text>
                          </TouchableOpacity>
                        </View>

                        {CATEGORIES[selectedSection].map((item, i) => (
                          <View key={item}>
                            <Select.Item className="py-2" index={i} value={item}>
                              <Select.ItemText className="text-base">{item}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
                                <AntDesign color={mainColor} name="check" size={25} />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Separator borderWidth={1} />
                          </View>
                        ))}
                      </>
                    )}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton />
              </Select.Content>
            </Select>
          )}
        />
        {errors.category && validationErrors[errors.category.type as keyof typeof validationErrors]}
      </View>
      <View>
        <Text className="mb-1 ml-2 text-base">Розмір *</Text>
        <Controller
          control={control}
          rules={{
            required: true,
          }}
          name="size"
          render={({ field: { onChange, value } }) => (
            <Select onOpenChange={hideKeyboardIfVisible} value={value} onValueChange={onChange}>
              <Select.Trigger
                disabled={!watchCategory}
                borderRadius="$main"
                opacity={100}
                iconAfter={<Entypo name="chevron-thin-down" size={16} />}>
                <Select.Value
                  className={`${getValues().size ? 'text-black' : 'text-[#979797]'}`}
                  placeholder={
                    !watchCategory ? 'Будь ласка, спершу оберіть категорію' : 'Оберіть розмір'
                  }
                />
              </Select.Trigger>
              <Adapt when="sm" platform="native">
                <Sheet
                  native
                  snapPoints={[50]}
                  modal
                  dismissOnSnapToBottom
                  animationConfig={{
                    type: 'spring',
                    damping: 150,
                    mass: 1.2,
                    stiffness: 450,
                  }}>
                  <Sheet.Frame className="rounded-none">
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Handle />
                  <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                </Sheet>
              </Adapt>
              <Select.Content>
                <Select.ScrollUpButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3">
                  Close
                </Select.ScrollUpButton>

                <Select.Viewport height={30}>
                  <Select.Group>
                    {sectionByCategory &&
                      SIZES[sectionByCategory as Section].map((item, i) => {
                        return (
                          <View key={item}>
                            <Select.Item className="py-2" index={i} value={item}>
                              <Select.ItemText className="text-base">{item}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
                                <AntDesign color={mainColor} name="check" size={25} />
                              </Select.ItemIndicator>
                            </Select.Item>
                            <Separator borderWidth={1} />
                          </View>
                        );
                      })}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton />
              </Select.Content>
            </Select>
          )}
        />
        {errors.size && validationErrors[errors.size.type as keyof typeof validationErrors]}
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
            <Select onOpenChange={hideKeyboardIfVisible} value={value} onValueChange={onChange}>
              <Select.Trigger
                borderRadius="$main"
                iconAfter={<Entypo name="chevron-thin-down" size={16} />}>
                <Select.Value
                  className={`${getValues().condition ? 'text-black' : 'text-[#979797]'}`}
                  placeholder="Будьте чесними"
                />
              </Select.Trigger>
              <Adapt when="sm" platform="native">
                <Sheet
                  native
                  snapPoints={[25]}
                  modal
                  dismissOnSnapToBottom
                  animationConfig={{
                    type: 'spring',
                    damping: 150,
                    mass: 1.2,
                    stiffness: 450,
                  }}>
                  <Sheet.Frame className="rounded-none">
                    <Sheet.ScrollView>
                      <Adapt.Contents />
                    </Sheet.ScrollView>
                  </Sheet.Frame>
                  <Sheet.Handle />
                  <Sheet.Overlay
                    animation="lazy"
                    enterStyle={{ opacity: 0 }}
                    exitStyle={{ opacity: 0 }}
                  />
                </Sheet>
              </Adapt>
              <Select.Content>
                <Select.ScrollUpButton
                  alignItems="center"
                  justifyContent="center"
                  position="relative"
                  width="100%"
                  height="$3">
                  Close
                </Select.ScrollUpButton>

                <Select.Viewport height={30}>
                  <Select.Group>
                    {CONDITIONS.map((item, i) => {
                      return (
                        <View key={item}>
                          <Select.Item className="py-2" index={i} value={item}>
                            <Select.ItemText className="text-base">{item}</Select.ItemText>
                            <Select.ItemIndicator marginLeft="auto">
                              <AntDesign color={mainColor} name="check" size={25} />
                            </Select.ItemIndicator>
                          </Select.Item>
                          <Separator borderWidth={1} />
                        </View>
                      );
                    })}
                  </Select.Group>
                </Select.Viewport>
                <Select.ScrollDownButton />
              </Select.Content>
            </Select>
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
              onChangeText={onChange}
              value={value}
            />
          )}
          name="price"
        />
        {errors.price?.message && <InputValidationError message={errors.price.message} />}
        {errors.price && validationErrors[errors.price.type as keyof typeof validationErrors]}
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
        className="mb-12">
        Створити
      </Button>
    </KeyboardAwareScrollView>
  );
}
