import { useEffect } from 'react';
import { useInstantSearch } from 'react-instantsearch-core';

import { useFilterStore } from '../../store/store';

type Props = {
  children: React.ReactNode;
};

const SearchSynchonization = ({ children }: Props) => {
  const search = useInstantSearch();
  const filterState = useFilterStore();

  useEffect(() => {
    search.setIndexUiState({ refinementList: { designer: filterState.designers } });
  }, [filterState]);

  return children;
};

export default SearchSynchonization;
