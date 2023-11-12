import { AntDesign, Entypo } from '@expo/vector-icons';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Adapt, Button, Input, ListItem, Select, Sheet, Text, View } from 'tamagui';

import { mainColor } from '../../../tamagui.config';
import { InputValidationError, validationErrors } from '../../components/ui/InputValidationErrors';
import TextArea from '../../components/ui/TextArea';
import { CATEGORIES, CONDITIONS, SIZES, Section } from '../../constants/listing';

const getSectionByCategory = (category: string) => {
  const section = Object.keys(CATEGORIES).find((key) =>
    CATEGORIES[key as Section].includes(category)
  );
  return section;
};

export default function SellScreen() {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
    watch,
    resetField,
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      price: '',
      description: '',
      condition: '',
      category: '',
      size: '',
    },
  });
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  const onSubmit = (data: Record<string, unknown>) => {
    console.log(data);
  };

  const watchCategory = watch('category');
  useEffect(() => {
    if (watchCategory) resetField('size');
  }, [watchCategory]);

  const sectionByCategory = useMemo(() => getSectionByCategory(watchCategory), [watchCategory]);

  return (
    <KeyboardAwareScrollView extraScrollHeight={25} className="flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="p-3 gap-y-3">
          <View>
            <Text className="mb-1 ml-2 text-base">Заголовок *</Text>
            <Controller
              control={control}
              rules={{ required: true, maxLength: 80 }}
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  size="$4"
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
                <View>
                  <Text className="absolute z-50  top-[18.5%] left-3 text-lg">₴</Text>
                  <Input
                    size="$4"
                    paddingLeft={30}
                    keyboardType="number-pad"
                    borderRadius="$main"
                    placeholder="Введіть ціну в гривнях"
                    className="w-full"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                  />
                </View>
              )}
              name="price"
            />
            {(errors.price?.message && <InputValidationError message={errors.price.message} />) ||
              (errors.price &&
                validationErrors[errors.price.type as keyof typeof validationErrors])}
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
                <Select value={value} onValueChange={onChange}>
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
                      snapPoints={[27]}
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
                            <Select.Item index={i} key={item} value={item}>
                              <Select.ItemText className="text-base">{item}</Select.ItemText>
                              <Select.ItemIndicator marginLeft="auto">
                                <AntDesign color={mainColor} name="check" size={20} />
                              </Select.ItemIndicator>
                            </Select.Item>
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
            <Text className="mb-1 ml-2 text-base">Категорія *</Text>
            <Controller
              control={control}
              rules={{
                required: true,
              }}
              name="category"
              render={({ field: { onChange, value } }) => (
                <Select value={value} onValueChange={onChange}>
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
                      snapPoints={[75]}
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
                              <Text className="font-bold text-lg">Оберіть секцію</Text>
                            </View>

                            {(Object.keys(CATEGORIES) as Section[]).map((section) => (
                              <ListItem
                                key={section}
                                className="bg-[#f8f8f8] text-red-500"
                                pressStyle={{ backgroundColor: '#f0f0f0' }}
                                onPress={() => setSelectedSection(section)}>
                                <ListItem.Text className="text-base">{section}</ListItem.Text>
                              </ListItem>
                            ))}
                          </>
                        )}
                        {selectedSection && (
                          <>
                            <View className="flex-row items-center justify-between p-4">
                              <Text className="font-bold text-lg">Оберіть категорію</Text>
                              <TouchableOpacity
                                className="flex-row items-center"
                                onPress={() => setSelectedSection(null)}>
                                <Text className="text-main text-base">Повернутись</Text>
                              </TouchableOpacity>
                            </View>

                            {CATEGORIES[selectedSection].map((item, i) => (
                              <Select.Item index={i} key={item} value={item}>
                                <Select.ItemText className="text-base">{item}</Select.ItemText>
                                <Select.ItemIndicator marginLeft="auto">
                                  <AntDesign color={mainColor} name="check" size={20} />
                                </Select.ItemIndicator>
                              </Select.Item>
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
            {errors.category &&
              validationErrors[errors.category.type as keyof typeof validationErrors]}
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
                <Select value={value} onValueChange={onChange}>
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
                              <Select.Item index={i} key={item} value={item}>
                                <Select.ItemText className="text-base">{item}</Select.ItemText>
                                <Select.ItemIndicator marginLeft="auto">
                                  <AntDesign color={mainColor} name="check" size={20} />
                                </Select.ItemIndicator>
                              </Select.Item>
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
          <Button
            onPress={handleSubmit(onSubmit)}
            size="$3"
            theme="active"
            fontSize="$5"
            borderRadius="$main"
            className="mb-10">
            Створити
          </Button>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAwareScrollView>
  );
}
