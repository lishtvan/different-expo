import { router } from 'expo-router';
import { useHits } from 'react-instantsearch-core';
import { Button } from 'tamagui';

import { getDynamicEndingShowButton } from '../../utils/common';

const ShowListingsButton = () => {
  const { results } = useHits();

  return (
    <Button
      theme="active"
      fontSize="$6"
      size="$5"
      borderRadius="$main"
      onPress={() => router.push({ pathname: '/' })}>
      {results && `Переглянути ${getDynamicEndingShowButton(results.nbHits)}`}
    </Button>
  );
};

export default ShowListingsButton;
