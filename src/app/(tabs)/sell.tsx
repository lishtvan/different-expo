import { AntDesign, Entypo } from '@expo/vector-icons';
import { Controller, useForm } from 'react-hook-form';
import { Keyboard, TouchableWithoutFeedback } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { Adapt, Button, Input, Select, Sheet, Text, View } from 'tamagui';

import { mainColor } from '../../../tamagui.config';
import { InputValidationError, validationErrors } from '../../components/ui/InputValidationErrors';
import TextArea from '../../components/ui/TextArea';
import { CONDITIONS } from '../../constants/listing';

export default function SellScreen() {
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm({
    mode: 'onChange',
    defaultValues: {
      title: '',
      price: '',
      description: '',
      condition: '',
    },
  });

  const onSubmit = (data: Record<string, unknown>) => {
    console.log(data);
  };

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
            {/* TODO: check validation message with keyboard */}
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
                            <Select.Item index={i} key={item} value={item.toLowerCase()}>
                              <Select.ItemText>{item}</Select.ItemText>
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
