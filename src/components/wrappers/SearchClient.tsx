import React from 'react';
import { InstantSearch } from 'react-instantsearch-core';

import { LISTINGS_COLLECTION } from '../../constants/listing';
import { searchClient } from '../../utils/searchClient';

type Props = {
  children: React.ReactNode;
};

const SearchClient = ({ children }: Props) => {
  return (
    <InstantSearch
      future={{ preserveSharedStateOnUnmount: true }}
      indexName={LISTINGS_COLLECTION}
      searchClient={searchClient}>
      {children}
    </InstantSearch>
  );
};

export default SearchClient;
