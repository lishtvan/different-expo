import { EvilIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import HomeListings from 'components/home/Listings';
import { INITIAL_PRICE } from 'constants/filter';
import { Link, Stack } from 'expo-router';
import { useAppState } from 'hooks/useAppState';
import { useRefresh } from 'hooks/useRefresh';
import React, { useMemo } from 'react';
import { useCurrentRefinements, useInstantSearch, useSearchBox } from 'react-instantsearch-core';
import { Dimensions, AppStateStatus, RefreshControl, TouchableOpacity } from 'react-native';
import { Button, Input, Text, View, XStack, debounce } from 'tamagui';
import { delay } from 'utils/common';
import { isAndroid } from 'utils/platform';

const HomeListingsWrapper = () => {
  const search = useInstantSearch();
  const { refreshing, refreshKey, handleRefresh, handleRefreshWithoutSpinner } = useRefresh(() =>
    delay(50)
  );
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

  const onAppStateChange = (status: AppStateStatus) => {
    if (status !== 'active') return;
    fullSearchRefresh(true);
  };

  useAppState(onAppStateChange);

  return (
    <HomeListings
      key={refreshKey}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={fullSearchRefresh} />}
    />
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
    <Link href="/filters" asChild>
      <TouchableOpacity className="ml-1 flex-row p-2">
        <MaterialCommunityIcons name="tune-variant" size={25} />
        {filtersCount > 0 && (
          <View className="ml-2 h-6 w-6 flex-row items-center justify-center rounded-full bg-main">
            <Text className="font-bold text-white">{filtersCount}</Text>
          </View>
        )}
      </TouchableOpacity>
    </Link>
  );
};

const ListingSearch = () => {
  const { refine } = useSearchBox();
  const debouncedRefine = debounce(refine, 150);
  const iconClassname = isAndroid ? 'p-0 pl-2 pb-1' : 'p-0 pl-2';

  return (
    <>
      <Button
        size="$4"
        icon={<EvilIcons name="search" size={30} />}
        className={iconClassname}
        borderTopLeftRadius="$main"
        borderBottomLeftRadius="$main"
        borderTopRightRadius="$0"
        backgroundColor="#f8f4f4"
        borderBottomRightRadius="$0"
        borderWidth="$0"
        borderRightWidth="$0"
      />
      <Input
        autoCorrect={false}
        placeholder="Пошук"
        backgroundColor="#f8f4f4"
        flex={1}
        paddingLeft={6}
        borderWidth="$0"
        onChangeText={debouncedRefine}
        borderRadius="$0"
        borderTopRightRadius="$main"
        borderBottomRightRadius="$main"
      />
    </>
  );
};

const CustomHeader = () => {
  const ScreenWidth = Dimensions.get('window').width;

  return (
    <XStack alignItems="center" style={{ width: ScreenWidth - 30 }}>
      <ListingSearch />
      <FiltersButton />
    </XStack>
  );
};

const HomeScreen = () => {
  return (
    <View>
      <Stack.Screen
        options={{ contentStyle: { paddingTop: 7 }, headerTitle: () => <CustomHeader /> }}
      />
      <HomeListingsWrapper />
    </View>
  );
};

export default HomeScreen;
