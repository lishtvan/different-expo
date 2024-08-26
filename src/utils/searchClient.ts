import TypesenseInstantsearchAdapter from 'typesense-instantsearch-adapter';

import { TYPESENSE } from '../config/config';

export const { searchClient } = new TypesenseInstantsearchAdapter(TYPESENSE);
