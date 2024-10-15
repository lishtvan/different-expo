import { Entypo, EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useQuery } from '@tanstack/react-query';
import HomeListings from 'components/home/Listings';
import { INITIAL_PRICE } from 'constants/filter';
import { Link, Stack } from 'expo-router';
import { useRefresh } from 'hooks/useRefresh';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useCurrentRefinements, useInstantSearch, useSearchBox } from 'react-instantsearch-core';
import { RefreshControl, TouchableOpacity } from 'react-native';
import { SearchBar } from 'react-native-elements';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, debounce } from 'tamagui';
import { delay } from 'utils/common';
import { fetcher } from 'utils/fetcher';
import { isAndroid } from 'utils/platform';

const HomeListingsWrapper = () => {
  const search = useInstantSearch();
  const { refreshing, refreshKey, handleRefresh, handleRefreshWithoutSpinner } = useRefresh(() =>
    delay(50)
  );

  const { data, isLoading } = useQuery({
    queryKey: ['auth_me'],
    queryFn: () => fetcher({ route: '/auth/me', method: 'GET' }),
  });

  const { refresh, setUiState } = search;

  const fullSearchRefresh = (reopen = false) => {
    setUiState((state) => {
      state.listings.page = 0;
      return state;
    });
    refresh();
    if (reopen) handleRefreshWithoutSpinner();
    else handleRefresh();
  };

  if (isLoading) return;

  return (
    <SafeAreaView edges={['top']}>
      <CustomHeader />
      <HomeListings
        key={refreshKey}
        blockedUsers={data?.BlockedUsers}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fullSearchRefresh} />}
      />
    </SafeAreaView>
  );
};

const FiltersButton = () => {
  const { items } = useCurrentRefinements({ excludedAttributes: ['status', 'query'] });

  const filtersCount = useMemo(() => {
    if (!items.length) return 0;

    const priceFilter = items.find((i) => i.attribute === 'price');
    if (!priceFilter) return items.length;
    const [min, max] = priceFilter.refinements.map((r) => r.label.split(' ')[1]);

    const maxChanged = max !== INITIAL_PRICE.MAX.toString();
    const minChanged = min !== INITIAL_PRICE.MIN.toString();
    const showPriceFilter = minChanged || maxChanged;
    if (!showPriceFilter) return items.length - 1;
    return items.length;
  }, [items]);

  return (
    <Link href="/filters/current_filters" asChild>
      <TouchableOpacity className=" w-[23%] flex-1 flex-row items-center justify-center py-2 pr-2">
        <View className="flex-1 flex-row items-center justify-center gap-x-2">
          <Text className="text-lg">Фільтри</Text>
          {filtersCount === 0 && (
            <MaterialCommunityIcons name="tune-variant" size={20} style={{ marginTop: 1 }} />
          )}
        </View>
        {filtersCount > 0 && (
          <View className="ml-1 h-6 w-6 flex-row items-center justify-center rounded-full bg-main">
            <Text className="font-bold text-white">{filtersCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );
};

const ListingSearch = ({
  focused,
  updateFocused,
}: {
  focused: boolean;
  updateFocused: (newFocused: boolean) => void;
}) => {
  const { refine } = useSearchBox();
  const [text, setText] = useState('');
  const debouncedRefine = debounce(refine, 150);

  const updateSearch = (newText: string) => {
    setText(newText);
    debouncedRefine(newText);
  };
  const searchRef = useRef();

  return (
    <SearchBar
      lightTheme
      searchIcon={() => (
        <EvilIcons name="search" size={28} style={{ marginBottom: isAndroid ? 5 : 0 }} />
      )}
      platform="ios"
      showLoading={false}
      ref={(ref) => {
        // @ts-expect-error refs suck
        searchRef.current = ref;
      }}
      value={text}
      onFocus={() => updateFocused(true)}
      onBlur={() => updateFocused(false)}
      onClear={() => updateSearch('')}
      // @ts-expect-error rn elements problem
      onChangeText={updateSearch}
      clearIcon={() => (
        <Entypo
          // @ts-expect-error refs suck
          onPressIn={() => searchRef.current?.clear()}
          onPress={() => {}}
          name="circle-with-cross"
          size={24}
          color="#c2c2c2"
        />
      )}
      containerStyle={{ width: focused ? '100%' : '73%' }}
      inputContainerStyle={{ height: 20, backgroundColor: '#f3f3f3' }}
      placeholder="Пошук"
      cancelButtonTitle=""
      autoCapitalize="sentences"
    />
  );
};

const CustomHeader = () => {
  const [focused, setFocused] = useState(false);
  const updateFocused = useCallback((newFocused: boolean) => {
    setFocused(newFocused);
  }, []);

  return (
    <View className="flex-row">
      <ListingSearch focused={focused} updateFocused={updateFocused} />
      {!focused && <FiltersButton />}
    </View>
  );
};

const HomeScreen = () => {
  return (
    <View>
      <Stack.Screen
        options={{
          headerShown: false,
          contentStyle: { marginBottom: 90 },
        }}
      />
      <HomeListingsWrapper />
    </View>
  );
};

export default HomeScreen;
