import { Link } from 'expo-router';
import { useHits } from 'react-instantsearch-core';
import { Button } from 'tamagui';
import { getDynamicEndingShowButton } from 'utils/common';

const ShowListingsButton = () => {
  const { results } = useHits();

  return (
    <Link href="/" asChild>
      <Button theme="active" fontSize="$6" size="$5" borderRadius="$main">
        {results && `Переглянути ${getDynamicEndingShowButton(results.nbHits)}`}
      </Button>
    </Link>
  );
};

export default ShowListingsButton;
