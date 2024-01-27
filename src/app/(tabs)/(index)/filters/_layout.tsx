import { Stack } from 'expo-router';

export default function FiltersLayout() {
  return (
    <Stack
      screenOptions={{
        headerShadowVisible: false,
        headerTitleAlign: 'center',
      }}>
      <Stack.Screen
        name="current_filters"
        options={{ headerTitle: 'Фільтри', headerBackVisible: false }}
      />
      <Stack.Screen name="designer_filter" options={{ headerTitle: 'Дизайнери' }} />
      <Stack.Screen name="category_filter" options={{ headerTitle: 'Категорія' }} />
      <Stack.Screen name="size_filter" options={{ headerTitle: 'Розмір' }} />
      <Stack.Screen name="condition_filter" options={{ headerTitle: 'Стан речі' }} />
      <Stack.Screen name="tags_filter" options={{ headerTitle: 'Теги' }} />
      <Stack.Screen name="price_filter" options={{ headerTitle: 'Ціна' }} />
    </Stack>
  );
}
