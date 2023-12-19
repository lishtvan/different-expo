import { Stack } from 'expo-router';

export default function FiltersLayout() {
  return (
    <Stack screenOptions={{ headerShadowVisible: false }}>
      <Stack.Screen name="current_filters" options={{ headerTitle: 'Фільтри' }} />
      <Stack.Screen name="designer_filter" options={{ headerTitle: 'Дизайнери' }} />
      <Stack.Screen name="category_filter" options={{ headerTitle: 'Категорія' }} />
    </Stack>
  );
}
