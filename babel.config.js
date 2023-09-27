process.env.TAMAGUI_TARGET = 'native';

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'transform-inline-environment-variables',
        // NOTE: include is optional, you can leave this part out
        {
          include: ['TAMAGUI_TARGET', 'EXPO_ROUTER_APP_ROOT'],
        },
      ],
      // Required for expo-router
      'expo-router/babel',
      'nativewind/babel',
      'react-native-reanimated/plugin',
    ],
  };
};
