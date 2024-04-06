import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

import { TYPESENSE } from '../config';

export const { searchClient } = new TypesenseInstantsearchAdapter(TYPESENSE);
