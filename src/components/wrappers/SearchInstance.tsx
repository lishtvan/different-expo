import React from 'react';
import { InstantSearch } from 'react-instantsearch-core';

import { LISTINGS_COLLECTION } from '../../constants/listing';
import { searchClient } from '../../utils/typesense';

type Props = {
  children: React.ReactNode;
};

const SearchInstance = ({ children }: Props) => {
  return (
    <InstantSearch indexName={LISTINGS_COLLECTION} searchClient={searchClient}>
      {children}
    </InstantSearch>
  );
};

export default SearchInstance;
