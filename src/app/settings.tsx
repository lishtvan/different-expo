import { Stack } from 'expo-router';
import React from 'react';
import { Keyboard, SafeAreaView, TouchableOpacity, TouchableWithoutFeedback } from 'react-native';
import { Text, Avatar, Input, View } from 'tamagui';

import TextArea from '../components/ui/TextArea';

const SettingsScreen = () => {
  return (
    <SafeAreaView className="flex-1">
      <Stack.Screen
        options={{
          headerRight: () => (
            <TouchableOpacity onPress={() => {}}>
              <Text className="text-base">Зберегти</Text>
            </TouchableOpacity>
          ),
        }}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="gap-y-3 flex-1 px-3 items-center">
          <Avatar circular size="$10" className="mb-2">
            <Avatar.Image src="https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg" />
            <Avatar.Fallback bc="green" delayMs={5000} />
          </Avatar>
          <Input size="$4" borderRadius="$main" placeholder="Нікнейм" className=" w-full" />
          <TextArea placeholder="Про себе" className="w-full" />
          <Input
            size="$4"
            borderRadius="$main"
            placeholder="Місце знаходження"
            className=" w-full"
          />
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default SettingsScreen;
