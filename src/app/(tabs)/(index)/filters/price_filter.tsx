import { Stack } from 'expo-router';
import React, { useState } from 'react';
import { useRange } from 'react-instantsearch-core';
import {
  Keyboard,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import { Input, Separator, View } from 'tamagui';

import ShowListingsButton from '../../../../components/home/ShowListingsButton';
import Delayed from '../../../../components/wrappers/Delayed';
import { INITIAL_PRICE } from '../../../../constants/filter';
import { isAndroid } from '../../../../utils/platform';

const PriceFilter = () => {
  const keyboardVerticalOffset = isAndroid ? 80 : 120;
  const behavior = isAndroid ? 'height' : 'padding';

  const { refine, start } = useRange({
    attribute: 'price',
    min: INITIAL_PRICE.MIN,
    max: INITIAL_PRICE.MAX,
  });

  const [selectedPrice, setSelectedPrice] = useState('');

  const [min, max] = start;
  const canReset = min !== INITIAL_PRICE.MIN || max !== INITIAL_PRICE.MAX;
  const [value, setValue] = useState([
    min === INITIAL_PRICE.MIN ? '' : min?.toString(),
    max === INITIAL_PRICE.MAX ? '' : max?.toString(),
  ]);

  const onMaxChange = (newMax: string) => {
    if (newMax === '0' || Number(newMax) > INITIAL_PRICE.MAX) return;
    setValue([value[0], newMax]);
    refine([start[0], Number(newMax)]);
  };

  const onMinChange = (newMin: string) => {
    if (newMin === '0') return;
    setValue([newMin, value[1]]);
    refine([Number(newMin), start[1]]);
  };

  const resetPrice = () => {
    refine([INITIAL_PRICE.MIN, INITIAL_PRICE.MAX]);
    setSelectedPrice('');
    setValue(['', '']);
  };

  const setMinPriceOnClick = (price: string) => {
    setValue([price, undefined]);
    setSelectedPrice(`${price}min`);
    refine([Number(price), undefined]);
    Keyboard.dismiss();
  };

  const setMaxPriceOnClick = (price: string) => {
    setValue([undefined, price]);
    setSelectedPrice(`${price}max`);
    refine([undefined, Number(price)]);
    Keyboard.dismiss();
  };

  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity className={`${canReset ? '' : 'hidden'} `} onPress={resetPrice}>
              <Text className="text-base">Видалити все</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          keyboardVerticalOffset={keyboardVerticalOffset}
          behavior={behavior}
          style={{ flex: 1, paddingTop: 16 }}
          contentContainerStyle={{ justifyContent: 'space-between' }}>
          <View className="flex-1 px-2">
            <View className="flex-row justify-around ">
              <Input
                size="$4"
                className="w-2/5"
                autoCorrect={false}
                borderRadius="$main"
                placeholder="Мінімум"
                keyboardType="number-pad"
                onChangeText={onMinChange}
                value={value[0]}
              />
              <Input
                size="$4"
                autoCorrect={false}
                borderRadius="$main"
                className="w-2/5"
                placeholder="Максимум"
                keyboardType="number-pad"
                onChangeText={onMaxChange}
                value={value[1]}
              />
            </View>
            <View className="mt-2">
              {['500', '1000', '2000', '3000'].map((i, key) => (
                <View key={key}>
                  <TouchableOpacity
                    onPress={() => setMaxPriceOnClick(i)}
                    className="py-2.5 px-2 mt-2">
                    <Text
                      className={`text-base ${selectedPrice === i + 'max' ? 'text-main font-bold' : 'text-black'}`}>
                      До {i} грн
                    </Text>
                  </TouchableOpacity>
                  <Separator borderColor="$gray7Light" />
                </View>
              ))}
              <TouchableOpacity
                onPress={() => setMinPriceOnClick('3000')}
                className="py-2.5 px-2 mt-2">
                <Text
                  className={`text-base ${selectedPrice === '3000min' ? 'text-main font-bold' : 'text-black'}`}>
                  Від 3000 грн
                </Text>
              </TouchableOpacity>
              <Separator borderColor="$gray7Light" />
            </View>
          </View>

          <View className="px-3 mb-2">
            <ShowListingsButton />
          </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

const PriceFilterScreen = () => {
  return (
    <Delayed waitBeforeShow={0}>
      <PriceFilter />
    </Delayed>
  );
};

export default PriceFilterScreen;
